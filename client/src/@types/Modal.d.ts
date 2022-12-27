export interface IModal {
  isOpen: boolean;
  isClosing: boolean;
  title: string;
  text: string;
  open: () => void;
  close: () => void;
  toggleIsClosing: () => void;
  modalSetup: (data: IModalSetup) => void;
}
export interface IModalSetup {
  title: string;
  text: string;
}
