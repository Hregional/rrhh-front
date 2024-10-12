import React from "react";
import { Helmet } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";

import Header from "./Header";
import Appointments from "./Appointments";
import BarChart from "./BarChart";
import Feed from "./Feed";
import PieChart from "./PieChart";
import Projects from "./Projects";
import Statistics from "./Statistics";

const Default = () => (
  <React.Fragment>
    <Helmet title="Dashboard" />
    <Container fluid className="p-0">
      <Header />
      <Statistics />
      <Row>
        <Col md="2" xl="4" className="d-flex">
          {/* Grafica */}
          <PieChart />
        </Col>
        <Col md="10" xl="8" className="d-flex">
          <Projects />
        </Col>
        {/* <Col lg="12" xl="4" className="d-flex">
          <Appointments />
        </Col> */}
      </Row>
      {/* <Row>
        <Col lg="8" className="d-flex">
          <BarChart />
        </Col> 
        <Col lg="4" className="d-flex">
          <Feed />
        </Col>
      </Row> */}
      
    </Container>
  </React.Fragment>
);

export default Default;
