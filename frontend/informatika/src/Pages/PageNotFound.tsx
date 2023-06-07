import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function PageNotFound() {
  let navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, []);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <h3>404 Iskana stran ne obstaja, preusmerjanje domov ...</h3>
      </div>
    </>
  );
}
