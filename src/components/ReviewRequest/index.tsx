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
    Grid,
    Button,
} from '@mantine/core';
import { useQuery, useMutation } from 'react-query';
import api from '../../api';
import { useState, useMemo } from 'react';
import models from './models.json';
import { TextInput } from '@mantine/core';
import Message from '../../components/Message';
import { gradeToInfo } from '../../helpers/gradeToInfo';
import {
    X,
    FileAlert,
    Check
} from 'tabler-icons-react';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import useImageUpload from './useImageUpload';
import Dialog from '../../components/Dialog'
import { v4 as uuidv4 } from 'uuid';
import { showNotification } from '@mantine/notifications';
import { useForm } from '@mantine/form';

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
    const [isDialogOpen, setOpenDialog] = useState(false)
    const form = useForm<FormValues>({
        initialValues: {
            email: '',
            selectedMan: null,
            selectedModel: null,
            year: 2022,
            grade: 'grade5',
            milage: null
        },

        validate: {},
    });

    const { data: manufacturers, isLoading } = useQuery('manufacturers', () => {
        return api.fetchMain();
    });

    const mutation = useMutation(
        () => {
            return api.calculatePrice(form.values);
        },
        {
            onSuccess: () => {
                setOpenDialog(true)
            },
            onError: () => { },
        },
    );

    let transformedModels = useMemo(() => realModels.filter(
        (item) => item.manId === parseInt(form.values.selectedMan),
    ), [form.values.selectedMan]);

    if (isLoading) {
        return null;
    }

    const handleFormSubmit = () => {
        return form.onSubmit((values) => {
            mutation.mutate()
        });
    };

    const handleSubmit = () => {
        const requestId = uuidv4()
        api.createRequest(requestId, {
            email: form.values.email,
            imageUrls,
            make: manufacturers.find(item => item.value === form.values.selectedMan) || {},
            model: transformedModels.find(item => item.value === form.values.selectedModel) || {},
            year: form.values.year || 2022,
            grade: form.values.grade,
            priceRange: mutation.data
        }).then(() => {
            const make = manufacturers.find(item => item.value === form.values.selectedMan) || {}

            api.sendDocument(requestId, make.label)

            setOpenDialog(false)
            showNotification({
                color: 'teal',
                icon: <Check />,
                message: 'Your document is sent, our expert will contact you soon ! 🚀',
            });
        })
    }

    const notValidated = !form.values.selectedModel || !form.values.selectedMan || !form.values.year || !form.values.email || !previews.length

    return (
        <main style={{ marginTop: '50px' }}>
            <Container size="xs" px="xs">
                <Paper shadow="xs" p="md">
                    <form onSubmit={handleFormSubmit()}>
                        <Title order={1} style={{ marginBottom: '10px' }}>
                            Car details
                        </Title>
                        <Select
                            required
                            transition="pop-top-left"
                            transitionDuration={80}
                            transitionTimingFunction="ease"
                            searchable
                            onChange={(data) => form.setFieldValue("selectedMan", data)}
                            value={form.values.selectedMan}
                            placeholder="Select manufacturer"
                            label="Choose your car"
                            data={manufacturers}
                        />
                        <Select
                            required
                            style={{ marginTop: '10px' }}
                            transition="pop-top-left"
                            transitionDuration={80}
                            transitionTimingFunction="ease"
                            searchable
                            onChange={(data) => form.setFieldValue("selectedModel", data)}
                            value={form.values.selectedModel}
                            placeholder="Select model"
                            label="Choose your model"
                            data={transformedModels}
                        />
                        <Grid grow style={{ marginTop: '10p' }}>
                            <Grid.Col span={6}>
                                <TextInput
                                    required
                                    style={{ marginTop: '10px' }}
                                    placeholder="Enter milage in kilometers"
                                    label="Enter milage (km)"
                                    value={form.values.milage}
                                    onChange={(event) => form.setFieldValue("milage", event.target.value)}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Select
                                    required
                                    style={{ marginTop: '10px' }}
                                    transition="pop-top-left"
                                    transitionDuration={80}
                                    transitionTimingFunction="ease"
                                    onChange={(data) => form.setFieldValue("year", data)}
                                    value={form.values.year}
                                    placeholder="Select year"
                                    label="Choose your year"
                                    data={years}
                                />
                            </Grid.Col>
                        </Grid>
                        <TextInput
                            required
                            style={{ marginTop: '10px' }}
                            placeholder="Enter email"
                            label="Contact info"
                            value={form.values.email}
                            onChange={(event) => form.setFieldValue("email", event.target.value)}
                        />
                        <div className="mt-4">
                            <SegmentedControl
                                value={form.values.grade}
                                onChange={(data) => form.setFieldValue("grade", data)}
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
                        <Message text={gradeToInfo[form.values.grade]} />
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
                                disabled={notValidated}
                                loading={mutation.isLoading}
                                variant="gradient"
                                type="submit"
                                fullWidth
                                gradient={{ from: 'indigo', to: 'cyan' }}>
                                {'Calculate price'}
                            </Button>
                        </div>
                    </form>
                </Paper>

            </Container>
            <Dialog isOpen={isDialogOpen} data={mutation.data} onClose={() => setOpenDialog(false)} onSubmit={handleSubmit} />
        </main >
    );
}

export default ReviewRequest;
