import React from "react";
import { Card, Dropdown } from "react-bootstrap";

import { MoreHorizontal } from "react-feather";

import DT from "react-datetime";

// @ts-ignore
const DateTime = DT.default ? DT.default : DT;

const Calendar = () => (
  <Card className="flex-fill w-100">
    <Card.Header>
      {/* <div className="card-actions float-end">
        <Dropdown align="end">
          <Dropdown.Toggle as="a" bsPrefix="-">
            <MoreHorizontal />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item>Acción</Dropdown.Item>
            <Dropdown.Item>Ortra Acción</Dropdown.Item>
            <Dropdown.Item>Algo más quí</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div> */}
      <Card.Title className="mb-0">Calendario</Card.Title>
    </Card.Header>
    <Card.Body className="d-flex">
      <div className="align-self-center w-100">
        {/* <DateTime input={false} dateFormat="L" timeFormat={false} /> */}
        <DateTime input={true} dateFormat="DD/MM/YYYY" timeFormat={false} />
      </div>
    </Card.Body>
  </Card>
);

export default Calendar;
