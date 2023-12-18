import React, { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

const Header = () => {
  const [environmentData, setEnvironmentData] = useState({
    //temperature: 0,
    //humidity: 0,
    moisture_level: 0,
    dust: 0,
  });

  const colors = {
    // temperature: {
    //   green: "bg-success text-white",
    //   red: "bg-danger text-white",
    //   yellow: "bg-info text-white", // Updated to blue for temperatures below 20°C
    // },
    // humidity: {
    //   green: "bg-info text-white",
    //   red: "bg-danger text-white",
    //   yellow: "bg-warning text-white",
    // },
    moisture_level: {
      green: "bg-primary text-white",
      red: "bg-danger text-white",
      yellow: "bg-warning text-white",
      black: "bg-black text-white", // Added black color for light values above 1023
    },
    dust: {
      green: "bg-secondary text-white",
      red: "bg-danger text-white",
      yellow: "bg-warning text-white",
    },
  };
  

  const getColorClass = (valueName, value) => {
    const valueColors = colors[valueName];
  
    switch (valueName) {
      // case "temperature":
      //   if (value > 30) {
      //     return valueColors.red;
      //   } else if (value >= 20 && value <= 30) {
      //     return valueColors.green;
      //   } else {
      //     return valueColors.yellow;
      //   }
      // case "humidity":
      //   if (value >= 70 && value <= 100) {
      //     return valueColors.green;
      //   } else if (value >= 50 && value < 70) {
      //     return valueColors.yellow;
      //   } else {
      //     return valueColors.red;
      //   }
      case "moisture_level":
        if (value > 1023) {
          return valueColors.black;
        } else {
          // Adjust the darkness of yellow based on the light value
          // const darkness = Math.floor((value / 1023) * 10); // Adjust 10 based on the desired darkness level
          return `bg-warning text-white`;
        }
      case "dust":
        // Add similar logic for "dust" if needed
        break;
      default:
        return valueColors.yellow;
    }
  };
  
  const generateRandomValues = async () => {
    try{
      const response = await fetch('http://localhost:8000/api/sensor');
      const data = await response.json();
  
      setEnvironmentData({
        // temperature: data.temperature,
        // humidity: data.humidity, 
        moisture_level: data.moisture_level,
        dust: data.dust
      });
    }catch (error) {
      console.log(error);
    }
    
  }

  // Call generateRandomValues instead of setting from MQTT
  useEffect(() => {
    const interval = setInterval(() => {
      generateRandomValues();
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
      <Container fluid>
        <div className="header-body">
          <Row>
            {/* <Col lg="6" xl="4">
              <Card
                className={`card-stats mb-4 mb-xl-0 ${getColorClass(
                  "temperature",
                  environmentData.temperature
                )}`}
              >
                <CardBody
                  className={`p-3 ${getColorClass(
                    "temperature",
                    environmentData.temperature
                  )}`}
                >
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-muted mb-0"
                      >
                        Temperature
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {environmentData.temperature}°C
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div
                        className={`icon icon-shape rounded-circle shadow ${getColorClass(
                          "temperature",
                          environmentData.temperature
                        )}`}
                      >
                        <i className="fas fa-thermometer-half" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span
                      className={`mr-2 ${getColorClass(
                        "temperature",
                        environmentData.temperature
                      )}`}
                    >
                      {environmentData.temperature > 0 ? (
                        <i className="fa fa-arrow-up" />
                      ) : (
                        <i className="fa fa-arrow-down" />
                      )}{" "}
                      {Math.abs(environmentData.temperature)}°
                    </span>{" "}
                    <span className="text-nowrap">Since yesterday</span>
                  </p>
                </CardBody>
              </Card>
            </Col>
            <Col lg="6" xl="4">
              <Card
                className={`card-stats mb-4 mb-xl-0 ${getColorClass(
                  "humidity",
                  environmentData.humidity
                )}`}
              >
                <CardBody
                  className={`p-3 ${getColorClass(
                    "humidity",
                    environmentData.humidity
                  )}`}
                >
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-muted mb-0"
                      >
                        Humidity
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {environmentData.humidity}%
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div
                        className={`icon icon-shape rounded-circle shadow ${getColorClass(
                          "humidity",
                          environmentData.humidity
                        )}`}
                      >
                        <i className="fas fa-tint" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span
                      className={`mr-2 ${getColorClass(
                        "humidity",
                        environmentData.humidity
                      )}`}
                    >
                      {environmentData.humidity > 0 ? (
                        <i className="fa fa-arrow-up" />
                      ) : (
                        <i className="fa fa-arrow-down" />
                      )}{" "}
                      {Math.abs(environmentData.humidity)}%
                    </span>{" "}
                    <span className="text-nowrap">Since yesterday</span>
                  </p>
                </CardBody>
              </Card>
            </Col> */}
            <Col lg="6" xl="4">
              <Card
                className={`card-stats mb-4 mb-xl-0 ${getColorClass(
                  "moisture_level",
                  environmentData.moisture_level
                )}`}
              >
                <CardBody
                  className={`p-3 ${getColorClass(
                    "moisture_level",
                    environmentData.moisture_level
                  )}`}
                >
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-muted mb-0"
                      >
                        moisture_level
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {environmentData.moisture_level}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div
                        className={`icon icon-shape rounded-circle shadow ${getColorClass(
                          "moisture_level",
                          environmentData.moisture_level
                        )}`}
                      >
                        <i className="fas fa-lightbulb" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span
                      className={`mr-2 ${getColorClass(
                        "moisture_level",
                        environmentData.moisture_level
                      )}`}
                    >
                      {environmentData.moisture_level > 0 ? (
                        <i className="fa fa-arrow-up" />
                      ) : (
                        <i className="fa fa-arrow-down" />
                      )}{" "}
                      {Math.abs(environmentData.moisture_level).toFixed(3)}
                    </span>{" "}
                    <span className="text-nowrap">Since yesterday</span>
                  </p>
                </CardBody>
              </Card>
            </Col>
            {/* <Col lg="6" xl="4">
              <Card
                className={`card-stats mb-4 mb-xl-0 ${getColorClass(
                  "dust",
                  environmentData.dust - 25
                )}`}
              >
                <CardBody
                  className={`p-3 ${getColorClass(
                    "dust",
                    environmentData.dust - 25
                  )}`}
                >
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-muted mb-0"
                      >
                        Dust
                      </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {environmentData.dust}
                      </span>
                    </div>
                    <Col className="col-auto">
                      <div
                        className={`icon icon-shape rounded-circle shadow ${getColorClass(
                          "dust",
                          environmentData.dust - 25
                        )}`}
                      >
                        <i className="fas fa-cloud" />
                      </div>
                    </Col>
                  </Row>
                  <p className="mt-3 mb-0 text-muted text-sm">
                    <span
                      className={`mr-2 ${getColorClass(
                        "dust",
                        environmentData.dust - 25
                      )}`}
                    >
                      {environmentData.dust - 25 > 0 ? (
                        <i className="fa fa-arrow-up" />
                      ) : (
                        <i className="fa fa-arrow-down" />
                      )}{" "}
                      {Math.abs(environmentData.dust - 25)} units
                    </span>{" "}
                    <span className="text-nowrap">Since yesterday</span>
                  </p>
                </CardBody>
              </Card>
            </Col> */}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Header;
