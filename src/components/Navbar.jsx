import { Button, useDisclosure } from "@chakra-ui/react";
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

export const Navbar = ({SaveNotes}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  return (
    <div className="bg-[#FEFDED] w-full h-[10vh] shadow-sm border-b-2 border-yellow-200">
      <div className="container flex  items-center h-full justify-between">
        <h1 className="comic-neue font-bold text-2xl text-[#ea5252] ">
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
              <Button colorScheme="green" onClick={()=>SaveNotes()}>Save</Button>
              <Button colorScheme="orange" variant="outline">
                Change Password
              </Button>
              <Button colorScheme="red">Delete</Button>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <div className="sm:flex gap-2 hidden">
          <Button colorScheme="green" onClick={()=>SaveNotes()}>Save</Button>
          <Button colorScheme="orange" variant="outline">
            Change Password
          </Button>
          <Button colorScheme="red">Delete</Button>
        </div>
      </div>
    </div>
  );
};
