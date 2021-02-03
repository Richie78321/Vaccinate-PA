import Link from "next/link";

export default function CountyLink({ county }) {
  const url = `/counties/${county.replace(" ", "_")}`;
  return (
    <>
      <Link href={url}>
        <a className="county-link rounded py-2 px-3 mb-3">{county}</a>
      </Link>
      <style jsx>{`
        .county-link {
          background: white;
          display: block;
          text-decoration: none;
          color: black;
          box-shadow: rgba(0, 0, 0, 0.1) 1px 1px 20px 2px;
        }
      `}</style>
    </>
  );
}
