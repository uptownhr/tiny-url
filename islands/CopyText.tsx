interface CopyText {
  text: string;
}

export default function CopyText(props: CopyText) {
  return (
    <code id="CopyText" className="mt-4 p-4 block bg-[lightgrey]">
      <a onClick={ () => navigator.clipboard.writeText(props.text)} href="#CopyText">{props.text}</a>
    </code>
  );
}
