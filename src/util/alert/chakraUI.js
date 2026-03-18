import { Alert } from "@chakra-ui/react";

const ChakraAlert = ({ alertStatus, message }) => {
  return (
    <Alert status={alertStatus}>
      {message}
    </Alert>
  );
};

export default ChakraAlert;

//  <Alert status="success">Data uploaded successfully!</Alert> 