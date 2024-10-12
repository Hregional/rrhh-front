import React, { useState } from "react";
import { Alert } from "react-bootstrap";

import Default from "../dashboards/Default";

function ProtectedPage() {
  const [show, setShow] = useState(true);

  return (
    <React.Fragment>
      <Default />
    </React.Fragment>
  );
}

export default ProtectedPage;
