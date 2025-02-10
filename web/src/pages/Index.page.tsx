import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function IndexPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/assistant')
  }, [])

  return <></>
}