// @ts-nocheck

import {
    Container,
    Paper,
    Text,
    Title,
    Select,
    SegmentedControl,
    Group,
    Loader,
    Button,
} from '@mantine/core';
import { useQuery, useMutation } from 'react-query';
import api from '../../api';
import { useState, useMemo } from 'react';
import models from './models.json';
import { TextInput } from '@mantine/core';
import Message from '../../components/Message';
import { gradeToInfo } from './gradeToInfo';
import {
    X,
    Icon,
    FileAlert,
    Check
} from 'tabler-icons-react';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import useImageUpload from './useImageUpload';
import Dialog from '../../components/Dialog'
import { v4 as uuidv4 } from 'uuid';
import { showNotification } from '@mantine/notifications';

const years = [
    {
        value: 2022,
        label: '2022',
    },
    {
        value: 2021,
        label: '2021',
    },
    {
        value: 2020,
        label: '2020',
    },
    {
        value: 2019,
        label: '2019',
    },
    {
        value: 2018,
        label: '2018',
    },
    {
        value: 2017,
        label: '2017',
    },
    {
        value: 2016,
        label: '2016',
    },
    {
        value: 2015,
        label: '2015',
    },
    {
        value: 2014,
        label: '2014',
    },
    {
        value: 2013,
        label: '2013',
    },
];

const realModels = models.map((item) => ({
    manId: item.man_id,
    value: item.model_id,
    label: item.model_name,
}));

function ReviewRequest() {
    const { onSelectImages, previews, imageUrls, resetImage, uploading, failed } =
        useImageUpload();
    const [selectedMan, setSelectedMan] = useState();
    const [selectedModel, setSelectedModel] = useState();
    const [mileage, setMilage] = useState();
    const [year, setYear] = useState();
    const [grade, setGrade] = useState('grade5');
    const [isDialogOpen, setOpenDialog] = useState(false)

    const { data: manufacturers, isLoading } = useQuery('manufacturers', () => {
        return api.fetchMain();
    });

    const mutation = useMutation(
        () => {
            return api.calculatePrice(
                selectedMan,
                selectedModel,
                mileage,
                year,
                grade,
            );
        },
        {
            onSuccess: () => {
                setOpenDialog(true)
            },
            onError: () => { },
        },
    );

    let transformedModels = useMemo(() => realModels.filter(
        (item) => item.manId === parseInt(selectedMan),
    ), [selectedMan]);

    if (isLoading) {
        return null;
    }

    const handleSubmit = () => {
        api.createRequest(uuidv4(), {
            imageUrls,
            make: manufacturers.find(item => item.value === selectedMan) || {},
            model: transformedModels.find(item => item.value === selectedModel) || {},
            year: year || 2022,
            grade
        }).then(() => {
            setOpenDialog(false)
            showNotification({
                color: 'teal',
                icon: <Check />,
                message: 'Your document is sent, our expert will contact you soon ! 🚀',
            });

        })
    }

    return (
        <main style={{ marginTop: '50px' }}>
            <Container size="xs" px="xs">
                <Paper shadow="xs" p="md">
                    <Title order={1} style={{ marginBottom: '10px' }}>
                        Car details
                    </Title>
                    <Select
                        transition="pop-top-left"
                        transitionDuration={80}
                        transitionTimingFunction="ease"
                        searchable
                        onChange={(data) => setSelectedMan(data)}
                        value={selectedMan}
                        placeholder="Select manufacturer"
                        label="Choose your car"
                        data={manufacturers}
                    />
                    <Select
                        style={{ marginTop: '10px' }}
                        transition="pop-top-left"
                        transitionDuration={80}
                        transitionTimingFunction="ease"
                        searchable
                        onChange={(data) => setSelectedModel(data)}
                        value={selectedModel}
                        placeholder="Select model"
                        label="Choose your model"
                        data={transformedModels}
                    />
                    <TextInput
                        style={{ marginTop: '10px' }}
                        placeholder="Enter milage in kilometers"
                        label="Enter milage (km)"
                        value={mileage}
                        onChange={(event) => setMilage(event.currentTarget.value)}
                    />
                    <Select
                        style={{ marginTop: '10px' }}
                        transition="pop-top-left"
                        transitionDuration={80}
                        transitionTimingFunction="ease"
                        onChange={(data) => setYear(data)}
                        value={year}
                        placeholder="Select year"
                        label="Choose your year"
                        data={years}
                    />
                    <div className="mt-4">
                        <SegmentedControl
                            value={grade}
                            onChange={setGrade}
                            fullWidth
                            data={[
                                { label: 'Grade 5', value: 'grade5' },
                                { label: 'Grade 4', value: 'grade4' },
                                { label: 'Grade 3', value: 'grade3' },
                                { label: 'Grade 2', value: 'grade2' },
                                { label: 'Grade 1', value: 'grade1' },
                            ]}
                        />
                    </div>
                    <Message text={gradeToInfo[grade]} />


                    {previews.length ? (
                        <div className="flex">
                            {previews.map(item => <div
                                className="w-32 h-32 mr-2 image-wrapper items-center flex justify-center"
                                onClick={() => resetImage(item)}>
                                {failed && (
                                    <div className="w-32 h-32 opacity-50 bg-black overflow-hidden rounded-full z-10 absolute flex items-center justify-center cursor-pointer image-error">
                                        <FileAlert color="red" size="40" />
                                    </div>
                                )}
                                {uploading ? (
                                    <div className="w-32 h-32  opacity-50 bg-black overflow-hidden rounded-full z-10 absolute flex items-center justify-center cursor-pointer">
                                        <Loader color="green" />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 opacity-0 hover:opacity-50 bg-black overflow-hidden rounded-full z-10 absolute flex items-center justify-center cursor-pointer">
                                        <X color="white" size="40" />
                                    </div>
                                )}
                                <img
                                    alt="profile-pic"
                                    src={item}
                                    className="w-32 h-32 object-cover rounded-md"
                                />
                            </div>)}
                        </div>
                    ) : (
                        <Dropzone onDrop={onSelectImages} accept={IMAGE_MIME_TYPE}>
                            <Group
                                position="center"
                                spacing="xl"
                                style={{ minHeight: 50, pointerEvents: 'none' }}>

                                <Dropzone.Idle>
                                    {/* <ImageUploadIcon size={50} stroke={1.5} /> */}
                                </Dropzone.Idle>
                                <div>
                                    <Text size="xl" inline>
                                        Click here to add car photos 🏎️
                                    </Text>
                                    <Text size="sm" color="dimmed" inline mt={7}>
                                        Attach as many files as you like, each file should not exceed 5mb
                                    </Text>
                                </div>
                            </Group>


                        </Dropzone>
                    )}
                    <div className="mt-2">
                        <Button
                            onClick={() => mutation.mutate()}
                            loading={mutation.isLoading}
                            variant="gradient"
                            type="submit"
                            fullWidth
                            gradient={{ from: 'indigo', to: 'cyan' }}>
                            {'Calculate price'}
                        </Button>
                    </div>
                </Paper>

            </Container>
            <Dialog isOpen={isDialogOpen} data={mutation.data} onClose={() => setOpenDialog(false)} onSubmit={handleSubmit} />
        </main >
    );
}

export default ReviewRequest;
