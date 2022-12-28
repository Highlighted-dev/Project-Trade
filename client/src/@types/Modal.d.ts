export interface IModal {
  isOpen: boolean;
  submittedList: ISubmittedList;
  isClosing: boolean;
  id: string;
  title: string;
  text: string;
  open: () => void;
  close: () => void;
  toggleIsClosing: () => void;
  addToSubmittedList: (id: string, submitted: boolean) => void;
  modalSetup: (data: IModalSetup) => void;
}
export interface ISubmittedList {
  [key: string]: boolean;
}
export interface IModalSetup {
  id: string;
  title: string;
  text: string;
}
