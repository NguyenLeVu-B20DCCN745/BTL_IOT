import Header from "components/Headers/Header.js";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  CustomInput,
} from "reactstrap";
import ChartComponent from "variables/charts.js";

const Index = (props) => {
  const [isAutoPumpOn, setAutoPumpOn] = useState(() => {
    // Kiểm tra localStorage để xem có trạng thái được lưu không
    const storedState = localStorage.getItem('autoPumpStatus');
    return storedState ? JSON.parse(storedState) : false;
  });

  const [isManualPumpOn, setManualPumpOn] = useState(() => {
    const storedState = localStorage.getItem('manualPumpStatus');
    return storedState ? JSON.parse(storedState) : false;
  });

  const [history, setHistory] = useState([]);
  const [autoStatusCount, setAutoStatusCount] = useState({ on: 0, off: 0 });
  const [manualStatusCount, setManualStatusCount] = useState({ on: 0, off: 0 });

  useEffect(() => {
    // Gọi API để lấy số lượng ON/OFF từ server
    fetch('http://localhost:8000/api/count')
      .then(response => response.json())
      .then(data => {
        setManualStatusCount({ on: data.soLuongON_MANUAL, off: data.soLuongOFF_MANUAL });
        setAutoStatusCount({ on: data.soLuongON_AUTO, off: data.soLuongOFF_AUTO });
      })
      .catch(error => {
        console.error('Error fetching status count:', error);
      });
  }, []); // useEffect sẽ chỉ chạy một lần sau khi component được render

  // Trong toggleAUTO
const toggleAUTO = () => {
  const newAutoState = !isAutoPumpOn;
  const action = newAutoState ? "ON" : "OFF";
  const device = "AutoPump";
  const time = new Date().toLocaleString();

  // Lưu trạng thái và thao tác vào localStorage
  localStorage.setItem('autoPumpStatus', JSON.stringify(newAutoState));

  const historyItem = { action, device, time };
  const history = JSON.parse(localStorage.getItem("history")) || [];
  history.push(historyItem);
  localStorage.setItem("history", JSON.stringify(history));

  // Tăng giá trị ON/OFF trực tiếp trên giao diện
  setAutoStatusCount(prevStatus => ({
    on: newAutoState ? prevStatus.on + 1 : prevStatus.on,
    off: newAutoState ? prevStatus.off : prevStatus.off + 1,
  }));

  setHistory([...history, historyItem]);
  setAutoPumpOn(newAutoState);

  // Gọi API để bật hoặc tắt Bơm tự động
  fetch('http://localhost:8000/api/auto', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isAutoPumpOn: newAutoState }),
  })
    .then(response => {
      if (response.status === 200) {
        // Xử lý khi gọi API thành công
        console.log('API call successful');
      } else {
        // Xử lý khi gọi API thất bại
        console.error('API call failed');
      }
    })
    .catch(error => {
      // Xử lý khi có lỗi xảy ra trong quá trình gọi API
      console.error('API call error:', error);
    });
};

// Tương tự cho toggleManual
const toggleManual = () => {
  const newManualState = !isManualPumpOn;
  const action = newManualState ? "ON" : "OFF";
  const device = "ManualPump";
  const time = new Date().toLocaleString();
  console.log('Toggling Manual Pump:', newManualState);
  // Lưu trạng thái và thao tác vào localStorage
  localStorage.setItem('manualPumpStatus', JSON.stringify(newManualState));

  const historyItem = { action, device, time };
  const history = JSON.parse(localStorage.getItem("history")) || [];
  history.push(historyItem);
  localStorage.setItem("history", JSON.stringify(history));

  // Tăng giá trị ON/OFF trực tiếp trên giao diện
  setManualStatusCount(prevStatus => ({
    on: newManualState ? prevStatus.on + 1 : prevStatus.on,
    off: newManualState ? prevStatus.off : prevStatus.off + 1,
  }));

  setHistory([...history, historyItem]);
  setManualPumpOn(newManualState);

  // Gọi API để bật hoặc tắt bơm
  fetch('http://localhost:8000/api/manual', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isManualPumpOn: newManualState }),
  })
    .then(response => {
      if (response.status === 200) {
        // Xử lý khi gọi API thành công
        console.log('API call successful');
      } else {
        // Xử lý khi gọi API thất bại
        console.error('API call failed');
      }
    })
    .catch(error => {
      // Xử lý khi có lỗi xảy ra trong quá trình gọi API
      console.error('API call error:', error);
    });
};


  const customInputStyle = {
    width: "60px",
    height: "30px",
    marginTop: "10px",
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card>
              <ChartComponent />
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Performance
                    </h6>
                    <h2 className="mb-0">Control Panel</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div>
                  <h4>AUTO PUMP</h4>
                  <p>ON: {autoStatusCount.on}</p>
                  <p>OFF: {autoStatusCount.off}</p>
                  <img
                    src={require(isAutoPumpOn
                      ? "assets/img/on.gif"
                      : "assets/img/off.png")}
                    alt="Auto"
                    style={{
                      maxWidth: "150px",
                      maxHeight: "150px",
                      marginLeft: "50px",
                    }}
                  />
                  <CustomInput
                    type="switch"
                    id="AutoSwitch"
                    className="custom-switch custom-control-lg"
                    checked={isAutoPumpOn}
                    onChange={toggleAUTO}
                  />
                </div>
                <div className="mt-4">
                  <h4>MANUAL PUMP</h4>
                  <p>ON: {manualStatusCount.on}</p>
                  <p>OFF: {manualStatusCount.off}</p>
                  <img
                    src={require(isManualPumpOn
                      ? "assets/img/on.gif"
                      : "assets/img/off.png")}
                    alt="Manual"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                  <CustomInput
                    type="switch"
                    id="ManualSwitch"
                    style={customInputStyle}
                    checked={isManualPumpOn}
                    onChange={toggleManual}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
