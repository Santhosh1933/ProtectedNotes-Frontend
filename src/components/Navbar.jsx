import { Button, Spinner, useDisclosure } from "@chakra-ui/react";
import React, { useRef } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { IoMenu } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export const Navbar = ({
  SaveNotes,
  saveLoading,
  DeleteRoute,
  deleteLoading,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const navigate = useNavigate();
  return (
    <div className="bg-[#FEFDED] w-full h-[10vh] shadow-sm border-b-2 border-yellow-200">
      <div className="container flex  items-center h-full justify-between">
        <h1
          onClick={() => {
            navigate("/");
          }}
          className="comic-neue cursor-pointer font-bold text-2xl text-[#ea5252] "
        >
          PROTECTED NOTES
        </h1>
        <div ref={btnRef} onClick={onOpen} className="sm:hidden visible">
          <IoMenu size={24} />
        </div>
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>
              {" "}
              <h1 className="comic-neue font-bold text-2xl text-[#ea5252] ">
                PROTECTED NOTES
              </h1>
            </DrawerHeader>

            <DrawerBody className="flex flex-col gap-4">
              <Button colorScheme="green" onClick={() => SaveNotes()}>
                Save
              </Button>
              <Button colorScheme="orange" variant="outline">
                Change Password
              </Button>
              <Button colorScheme="red">Delete</Button>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <div className="sm:flex gap-2 hidden">
          {saveLoading ? (
            <Button gap={2} colorScheme="green">
              Save <Spinner size="sm" />
            </Button>
          ) : (
            <Button colorScheme="green" onClick={() => SaveNotes()}>
              Save
            </Button>
          )}
          {deleteLoading ? (
            <Button colorScheme="red" className="flex gap-2">
              Delete
              <Spinner size="sm" />
            </Button>
          ) : (
            <Button colorScheme="red" onClick={DeleteRoute} >
              Delete
            </Button>
          )}

          {/* <Button  colorScheme="orange" variant="outline">
            Change Password
          </Button> */}
        </div>
      </div>
    </div>
  );
};
