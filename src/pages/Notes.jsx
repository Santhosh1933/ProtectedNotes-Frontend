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
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { backendUrl } from "../../constant";

export const Notes = () => {
  const Navigate = useNavigate();
  const location = useLocation();
  const [viewNotes, setViewNotes] = useState(false);
  const [viewPassword, setViewPassword] = useState("");
  const [notes, setNotes] = useState(null);
  const [notesLoading, setNotedLoading] = useState(false);

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
      authOnOpen();
      // getNotes(passwords.viewPassword);
      // setViewNotes(true);
    } catch (error) {}
  }

  useEffect(() => {
    checkRoute();
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: authIsOpen,
    onOpen: authOnOpen,
    onClose: authOnClose,
  } = useDisclosure();
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

  async function getNotes() {
    try {
      setNotedLoading(true);
      const res = await fetch(
        `${backendUrl}/notes?route=${location.pathname.substring(
          1
        )}&viewPassword=${viewPassword}`
      );
      const data = await res.json();
      if (res.status === 401) {
        alert("Incorrect Password");
        return;
      }
      if (res.status === 404) {
        Navigate("/");
        return;
      }
      if (res.status === 402) {
        return;
      }
      setNotes(data.notes);
      setViewNotes(true);
      authOnClose();
    } catch (error) {
    } finally {
      setNotedLoading(false);
    }
  }
  console.log(notes);
  return (
    <>
      {viewNotes && (
        <div className="container">
          <h1 className="text-2xl title text-primaryText text-center py-16">
            Protected Notes Welcomes You Again 🔑
          </h1>
          <div className="bg-slate-50 rounded-md p-1">
            {notes ? (
              <Tabs variant="enclosed">
                <TabList>
                  {notes.map((note) => (
                    <Tab key={note.id}>{note.tabName}</Tab>
                  ))}
                </TabList>
                <TabPanels>
                  {notes.map((note) => (
                    <TabPanel key={note.id} className="h-full">
                      {/* <div
                        dangerouslySetInnerHTML={{ __html: note.content }}
                      ></div>
                       */}
                       <iframe srcDoc={note.content} frameborder="0" style={{ width: '100%', height: '60vh' }}></iframe>
                    </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
      <Modal
        closeOnOverlayClick={false}
        isOpen={authIsOpen}
        onClose={authOnClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Welcomes you to Protected Notes 🔑</ModalHeader>
          <ModalBody>
            <div>
              <p className="text-[#ea5252] pb-4">Password for View Access</p>
              <Input
                type="password"
                name="viewPassword"
                value={viewPassword}
                onChange={(e) => setViewPassword(e.target.value)}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            {notesLoading ? (
              <Button colorScheme="blue" mr={3}>
                loading <Spinner />
              </Button>
            ) : (
              <Button colorScheme="blue" mr={3} onClick={getNotes}>
                View
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

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
