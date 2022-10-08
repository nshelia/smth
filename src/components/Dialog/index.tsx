import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { Button, Text } from '@mantine/core'

export default function MyModal({ isOpen, onSubmit, data, onClose }: { isOpen: boolean, onSubmit: () => void, onClose: () => void, data: any }) {

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={onClose}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Do you accept this price range ?
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            This is price range based on your input, if this acceptable we will finalize this with our expert.
                                        </p>
                                    </div>
                                    {data && <Text color="teal" style={{ textAlign: "center", margin: "10px 0px", fontSize: "36px" }}>${data.from} - ${data.to}</Text>}
                                    <div className="flex">
                                        <Button
                                            onClick={onSubmit}
                                            style={{ marginRight: "10px" }}
                                            fullWidth
                                            variant="gradient"
                                            gradient={{ from: 'teal', to: 'lime', deg: 105 }}>
                                            {"Accept"}
                                        </Button>
                                        <Button
                                            onClick={onClose}
                                            fullWidth
                                            variant="gradient"
                                            gradient={{ from: 'red', to: 'red', deg: 105 }}>
                                            {"Dismiss"}
                                        </Button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
