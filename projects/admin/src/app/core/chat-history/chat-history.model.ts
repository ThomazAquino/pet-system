export enum MessagePosition {
  income = 'income',
  outgoing = 'outgoing',
}
export interface Message {
  position: MessagePosition,
  time: Date,
  content: string
}