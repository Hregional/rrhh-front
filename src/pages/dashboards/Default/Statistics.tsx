import React from "react";
import { useTranslation } from "react-i18next";
import { Badge, Col, Card, Row } from "react-bootstrap";
import Calendar from "./Calendar";
import { DollarSign, ShoppingBag } from "react-feather";

import illustration from "../../../assets/img/illustrations/customer-support.png";

const Statistics = () => {
  const { t } = useTranslation();

  return (
    <Row>
      <Col xs="12" xl="4">
        <Calendar />
      </Col>
      <Col md="12" xl="8">
        <Row>
        <Col md="6" xl className="d-flex">
          <Card className="flex-fill">
            <Card.Body className=" py-4">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <h3 className="mb-2">En Vacaciones</h3>
                  <div className="mb-0">

                  </div>
                </div>
                <div className="d-inline-block ms-3">

                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md="6" xl className="d-flex">
          <Card className="flex-fill">
            <Card.Body className=" py-4">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <h3 className="mb-2">Susependidos</h3>
                </div>
                <div className="d-inline-block ms-3">

                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md="6" xl className="d-flex">
          <Card className="flex-fill">
            <Card.Body className=" py-4">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <h3 className="mb-2">Citas IGSS</h3>
                  <div className="mb-0">
                  
                  </div>
                </div>
                <div className="d-inline-block ms-3">
                  <div className="stat">
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </Col>
    </Row>
    
  );
};

export default Statistics;
