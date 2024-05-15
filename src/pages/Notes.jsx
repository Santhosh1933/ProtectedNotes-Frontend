import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { backendUrl } from "../../constant";

export const Notes = () => {
  const Navigate = useNavigate();
  const location = useLocation();
  const [viewNotes, setViewNotes] = useState(false);
  async function checkRoute() {
    try {
      const res = await fetch(
        `${backendUrl}/route?route=${location.pathname.substring(1)}`
      );
      const data = await res.json();
      if (res.status !== 200) {
        onOpen();
        return;
      }
      setViewNotes(true);
    } catch (error) {}
  }

  useEffect(() => {
    checkRoute();
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [passwords, setPasswords] = useState({
    viewPassword: "",
    editPassword: "",
  });

  const [createRouteLoading, setCreateLoading] = useState(false);

  function handlePasswordChange(event) {
    const { name, value } = event.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));
  }

  async function createRoute() {
    try {
      setCreateLoading(true);
      const response = await fetch(`${backendUrl}/create-route`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: location.pathname.substring(1),
          editPassword: passwords.editPassword,
          viewPassword: passwords.viewPassword,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }
      const responseData = await response.json();
      Navigate(`/edit/${location.pathname.substring(1)}`);
    } catch (error) {
      alert(error);
    } finally {
      setCreateLoading(false);
    }
  }

  return (
    <>
      {viewNotes && <>
        
      </>}

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-[#ea5252]">
            No Site On that Name
          </ModalHeader>
          <ModalBody>
            <p>
              Create a Password for Both Edit Access and View Access for your
              Notes
            </p>
            <div className="py-4">
              <p>Password for Edit Access</p>
              <Input
                type="password"
                name="editPassword"
                value={passwords.editPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div>
              <p>Password for View Access</p>
              <Input
                type="password"
                name="viewPassword"
                value={passwords.viewPassword}
                onChange={handlePasswordChange}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                onClose();
                setPasswords({
                  viewPassword: "",
                  editPassword: "",
                });
              }}
            >
              Cancel
            </Button>
            {createRouteLoading ? (
              <Button variant="ghost">Loading...</Button>
            ) : (
              <Button variant="ghost" onClick={createRoute}>
                Create Notes
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
