/* eslint-disable arrow-body-style */
import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit, ViewChild, ElementRef, Inject, Input, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Tutor } from '../../../core/tutors/tutors.model';
import { SocketConnectionStatus, WebSocketService } from '../../../core/web-socket/web-socket.service';
import { environment as env } from '../../../../environments/environment';
import { CallData } from '../chat.component';
import { AuthService } from '../../../core/auth/auth.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { NotificationService } from '../../../core/notifications/notification.service';

export interface Message {
  type: string,
  data: any
}
export enum CallPosition {
  calling = 'calling',
  receiving = 'receiving'
}

interface MediaConstraints {
  audio: boolean,
  video?: { with: number, height: number}
}

const offerOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true,
}

@Component({
  selector: 'pet-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CallComponent implements OnInit, AfterViewInit {
  @ViewChild('localVideo') localVideo: ElementRef;
  @ViewChild('remoteVideo') remoteVideo: ElementRef;

  @Input() callPosition: CallPosition;

  public apiPrefix = env.apiPrefix;
  public remoteStreamInfo: {audio?: {enabled?: boolean, muted?: boolean}, video?: {enabled?: boolean, muted?: boolean}} = {audio: {}, video: {}};
  public localStreamInfo:  {audio?: {enabled?: boolean, muted?: boolean}, video?: {enabled?: boolean, muted?: boolean}} = {audio: {}, video: {}};
  public videoWidth: number;
  public connectionState: RTCPeerConnectionState;

  private _browserWidth: number;
  private _subscriptions: Subscription[] = [];
  private _callInProgress = false;
  private _mediaConstraints: MediaConstraints = { audio: true };
  private _localStream: MediaStream;
  private _peerConnection: RTCPeerConnection;
  private _iceCandidates: RTCIceCandidate[] = [];
  private _remoteSessionDescription: RTCSessionDescription | RTCSessionDescriptionInit;
  
  constructor(
    public dialogRef: MatDialogRef<CallComponent>,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
    private webSocketService: WebSocketService,
    private breakpointObserver: BreakpointObserver,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: CallData
    ) {}

  ngOnInit() {
    this._remoteSessionDescription = this.data.remoteSessionDescription;
    this.callPosition = this.data.callState;
    if (this.data.haveVideo) {
      this._mediaConstraints.video = {with: 320, height: 240};
      this.localStreamInfo.video.enabled = true;
    }

    this.setVideoSize();
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
      Breakpoints.Handset,
      Breakpoints.Tablet,
      Breakpoints.Web,
    ]).subscribe(result => {
      this.setVideoSize();
      this.cdr.detectChanges();
    });

    console.log('Dialog data,', this.data);
    this.handleSignalingServer();
  }

  handleSignalingServer() {
    this.webSocketService.connectionStatus.pipe(
      filter(status => status === SocketConnectionStatus.connected || status === SocketConnectionStatus.rejected),
    ).subscribe(status => {
      if (status === SocketConnectionStatus.connected) {

        this._subscriptions.push(this.webSocketService.listen('messageResponse').subscribe((message: any) => {
          switch (message.message.type) {
            case 'offer':
              this.handleOfferMessage(message.message.data);
              break;
          
            case 'answer':
              this.handleAnswerMessage(message.message.data);
              break;
          
            case 'ice-candidate':
              this._iceCandidates.push(message.message.data);
              if (this._callInProgress) {
                this.handleIceCandidateMessage(message.message.data);
              }
              break;
  
            case 'change-stream':
              this.handleRemoteChangeStream(message.message.data);
              break;
  
            case 'hangup':
              // no data here
              this.handleHangupMessage(message.message);
              break;
          
            default:
              console.error('Unknown message type', message.message);
              break;
          }
        }));
      }
    });
  }

  setVideoSize(): void {
    this._browserWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    this.videoWidth = (this._browserWidth / 2) - 40;
    console.log('videoWidth', this.videoWidth)
  }

  async ngAfterViewInit() {
    await this.requestMediaDevices();

    if (!this._localStream) {
      return;
    }

    if (this.data.callState === CallPosition.calling) {
      if (this._mediaConstraints.video) {
        this.startLocalVideo();
      }
      this.call();
    }
  }

  pauseLocalVideo(): void {
    this._localStream.getTracks().forEach(track => track.enabled = false);
    this.localVideo.nativeElement.srcObject = undefined;
  }

  startLocalVideo(): void {
    this._localStream.getTracks().forEach(track => track.enabled = true);
    this.localVideo.nativeElement.srcObject = this._localStream;
  }

  async call(): Promise<void> {
    // Finds ice candidates/securityu options/ audio a  nmd video build the SDP and sent id via web socket
    this.createPeerConnection();

    /* Add all local tracks to peerConnection. */
    this._localStream.getTracks().forEach(track => {
      this._peerConnection.addTrack(track, this._localStream)
    });

    
    try {
      /* Build offer. */
      const offer: RTCSessionDescriptionInit = await this._peerConnection.createOffer(offerOptions);
      await this._peerConnection.setLocalDescription(offer);

      this.webSocketService.emit('socket log', {data: 'trying to make a call'});
      this.webSocketService.emit('message', {message: {type: 'offer', data: offer}, to: this.data.incomingUser.id});
        

      /* Send the offer to webSocket */
    } catch (error) {
      this.handleGetUserMediaError(error);
    }
  }

  createPeerConnection(): void {
    /* Stun server config. */
    const servers = {
      iceServers: [{
        urls: ['stun:stun.l.google.com:19302', 'stun:stun2.l.google.com:19302']
      }]
    }
    this._peerConnection = new RTCPeerConnection(servers);

    /* peerConnection event Handlers. */
    this._peerConnection.onicecandidate = this.handleICECandidateEvent;
    // this.peerConnection.onicegatheringstatechange = this.handleICEConnectionStateChangeEvent;
    this._peerConnection.onsignalingstatechange = this.handleSignalingStateChangeEvent;
    this._peerConnection.ontrack = this.handleRemoteTrackEvent;
    this._peerConnection.onconnectionstatechange = this.handleConnectionStatechange;
    console.log('created')
  }

  closeVideoCall(): void {
    if (this._peerConnection) {
      this._peerConnection.onicecandidate = null;
      this._peerConnection.onicegatheringstatechange = null;
      this._peerConnection.onsignalingstatechange = null;
      this._peerConnection.ontrack = null;
  
      this._peerConnection.getTransceivers().forEach(transceiver => transceiver.stop());
  
      /* Reset peerConnection. */
      this._peerConnection.close();
      this._peerConnection = null;
    }

    this.connectionState = 'disconnected';
    this.cdr.detectChanges();

    setTimeout(() => {
      console.log('closing')
      this.dialogRef.close();
      this.cdr.detectChanges();
    }, 1000);

  }
  

  handleGetUserMediaError(e: Error): void {
    console.error('Error in open the camera', e);
    switch (e.name) {
      case 'notFoundError':
        this.notificationService.error('Nenhuma camera ou microfone econtrado.');
        break;
      
      case 'securityError':
      case 'PermissionDeniedError':
      case 'NotAllowedError':
        this.notificationService.error('Permissão para audio e vídeo negada.');
        break;
    
      default:
        this.notificationService.error('Erro ao abrir a camera ou microfone.');
        break;
    }

    if (this.callPosition === CallPosition.receiving) {
      setTimeout(() => this.webSocketService.emit('message', {message: {type: 'hangup', data: ''}, to: this.data.incomingUser.id}), 2000);
    }
    // setTimeout(() => this.closeVideoCall(), 4000);
  }

  hangup(): void {
    this.webSocketService.emit('message', {message: {type: 'hangup', data: ''}, to: this.data.incomingUser.id});
    this.closeVideoCall();
  }

  // New methods

  async pickupCall(hasVideo: boolean = false): Promise<void> {
    if (hasVideo) {
      this._mediaConstraints.video = {with: 320, height: 240};
      this.localStreamInfo.video.enabled = true;
    }

    await this.requestMediaDevices();
    this.localStreamInfo.audio.enabled = true;

    this.createPeerConnection();
    
    if (hasVideo) {
      this.startLocalVideo();
    }

    // Use all information from the localStream and create a answer.
    this._peerConnection.setRemoteDescription(new RTCSessionDescription(this._remoteSessionDescription))
      .then(() => {
        this.localVideo.nativeElement.srcObject = this._localStream;
        this._localStream.getTracks().forEach(track => this._peerConnection.addTrack(track, this._localStream));
      
      }).then(() => {
        return this._peerConnection.createAnswer();

      }).then((answer: RTCSessionDescription) => {
        return this._peerConnection.setLocalDescription(answer);
      
      }).then(() => {
        this.webSocketService.emit('message', {message: {type: 'answer', data: this._peerConnection.localDescription}, to: this.data.incomingUser.id});
      }).catch(this.handleGetUserMediaError);

      this._iceCandidates.forEach(ice => this.handleIceCandidateMessage(ice));

  }

  async toggleVideoStream(): Promise<void> {
    this._localStream.getTracks().forEach(_track => {
      if (_track.kind === 'video') {
        _track.enabled = !_track.enabled;
        this.localStreamInfo.video.muted = !_track.enabled;
      }
    });

    // Case the video is not activated yet.
    if (!this.localStreamInfo.video.enabled) {
      console.log('Activating camera on fly.');
      this._mediaConstraints.video = {with: 320, height: 240};
      await this.requestMediaDevices();
      this._localStream.getTracks().forEach(track => {
        if (track.kind === 'video') {
          this._peerConnection.addTrack(track, this._localStream);
        }
      });
      this.localStreamInfo.video.enabled = true;
      this.localStreamInfo.video.muted = false;
      this.startLocalVideo();

      // TODO: Add track to remote user see it.
    }

    this.webSocketService.emit('message', {message: {type: 'change-stream', data: {video: {muted: this.localStreamInfo.video.muted}}}, to: this.data.incomingUser.id});
    this.cdr.detectChanges();
  }

  handleRemoteChangeStream(change): void {
    const stream = Object.keys(change)[0];
    this.remoteStreamInfo[stream].muted = change[stream].muted;
    this.remoteStreamInfo[stream].enabled = true;
    this.cdr.detectChanges();
  }

  toggleAudioStream(): void {
    this._localStream.getTracks().forEach(track => {
      if (track.kind === 'audio') {
        track.enabled = !track.enabled;
        this.localStreamInfo.audio.muted = !track.enabled;
        this.webSocketService.emit('message', {message: {type: 'change-stream', data: {audio: {muted: this.localStreamInfo.audio.muted}}}, to: this.data.incomingUser.id});
      }
    });
    this.cdr.detectChanges();
  }


  private async requestMediaDevices(): Promise<void> {
    await navigator.mediaDevices.getUserMedia(this._mediaConstraints).then(media => {
      this._localStream = media;
    }).catch(error => {
      this.handleGetUserMediaError(error);
    });
    // this.startLocalVideo();
    // navigator.mediaDevices.ondevicechange = function(event) {
    //   console.log(event)
    //   debugger
    // }
    // navigator.mediaDevices.addEventListener('devicechange', function(event) {
    //   console.log(event)
    //   debugger
    // });
  }


  // Event handlers:

  private handleICECandidateEvent = (event: RTCPeerConnectionIceEvent) => {
    console.log('handleICECandidateEvent');
    if (event.candidate) {
      this.webSocketService.emit('message', {message: {type: 'ice-candidate', data: event.candidate}, to: this.data.incomingUser.id});
    }
  }

  private handleConnectionStatechange = (event) => {
    this.connectionState = event.target.connectionState;
    console.log('handleConnectionStatechange --> ', this.connectionState);

    switch (this._peerConnection.iceConnectionState) {
      case 'connected':
        break;

      case 'closed':
      case 'failed':
      case 'disconnected':
        this.closeVideoCall();
        break;
    }
    this.cdr.detectChanges()
  }

  private handleSignalingStateChangeEvent = (event: Event) => {
    console.log('handleSignalingStateChangeEvent');
    switch (this._peerConnection.signalingState) {
      case 'closed':
        this.closeVideoCall();
        break;
    }
  }

  /* When the track from remote part comes.*/
  private handleRemoteTrackEvent = (event: RTCTrackEvent) => {
    console.log('handleRemoteTrackEvent ', event.track.kind);
    this.remoteStreamInfo[event.track.kind].enabled = true;
    this.remoteVideo.nativeElement.srcObject = event.streams[0];
    console.log('remoteStream --> ', this.remoteStreamInfo)
  }



  // Depreciated
  private handleOfferMessage(message: RTCSessionDescriptionInit): void {
    // if (!this.peerConnection) {
    //   this.createPeerConnection();
    // }

    // if (!this.localStream) {
    //   this.startLocalVideo();
    // }

    // // Use all information from the localStream and create a answer.
    // this.peerConnection.setRemoteDescription(new RTCSessionDescription(message))
    //   .then(() => {
    //     this.localVideo.nativeElement.srcObject = this.localStream;
    //     this.localStream.getTracks().forEach(track => this.peerConnection.addTrack(track, this.localStream));
      
    //   }).then(() => {
    //     return this.peerConnection.createAnswer();

    //   }).then((answer: RTCSessionDescription) => {
    //     console.log('answer',answer)
    //     return this.peerConnection.setLocalDescription(answer);
      
    //   }).then(() => {
    //     this.webSocketService.emit('message', {message: {type: 'answer', data: this.peerConnection.localDescription}, to: this.data.incomingUser.id});
    //   }).catch(this.handleGetUserMediaError)
  }

  private handleAnswerMessage(remoteSessionDescription: RTCSessionDescription): void {
    if (!this._peerConnection) {
      return
    }
    this._peerConnection.setRemoteDescription(remoteSessionDescription);
  }

  
  /** Add incoming IceCandidate on local PeerConnection. */
  private handleIceCandidateMessage(incomingIceCandidate: RTCIceCandidate): void {
    this._peerConnection.addIceCandidate(incomingIceCandidate).catch(this.reportError)
  }

  private handleHangupMessage(message: Message): void {
    this.closeVideoCall();
  }

  private reportError(e: Error): void {
    console.log('::ERROR:', e.name);
    console.log(e);
  }


  
}
