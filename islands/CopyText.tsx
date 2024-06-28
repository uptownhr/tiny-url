interface CopyText {
  text: string;
}

export default function CopyText(props: CopyText) {
  return (
    <code onClick={ () => navigator.clipboard.writeText(props.text)} className="mt-4 p-4 block bg-[WhiteSmoke] relative cursor-pointer">
      <span class="absolute top-1 right-1">📋</span><a  href="#CopyText">{props.text}</a>
    </code>
  );
}
