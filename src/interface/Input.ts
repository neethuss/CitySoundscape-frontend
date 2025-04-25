export default interface InputProps{
  id?:string
  type?: string;
  value?: string;
  accept?:string
  name?:string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
}