import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const Notes = () => {
  const [state, setState] = useState("New Site");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const Navigate = useNavigate();

  switch (state) {
    case "New Site":
      useEffect(() => onOpen());
      return (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader className="text-[#ea5252]">
              Create New Site
            </ModalHeader>
            <ModalBody>
              there is no site in the name you give,so it's yours now. Are you
              certain you want to proceed with creating the site?
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  Navigate("/");
                }}
              >
                Cancel
              </Button>
              <Button variant="ghost" onClick={()=>{
                Navigate("/new/s")
              }}>Create Note</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      );
    case "Existing Site":
      return <></>;
    default:
      break;
  }

  return (
    <div>
      <Navbar />
    </div>
  );
};
