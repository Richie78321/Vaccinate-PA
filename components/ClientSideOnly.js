import { useEffect, useState } from "react";

export default function ClientSideOnly({ children }) {
  const [isClientSide, setIsClientSide] = useState(false);

  // Effect is only run by client. https://blog.hao.dev/render-client-side-only-component-in-next-js
  useEffect(() => {
    setIsClientSide(true);
  });

  return isClientSide ? <>{children}</> : null;
}
