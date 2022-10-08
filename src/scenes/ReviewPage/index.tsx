import {
    Box,
    Paper,
    LoadingOverlay,
    Image,
    Button,
    Card,
    Text,
    NumberInput,
    Textarea,
    Title
} from '@mantine/core';
import { useQuery, useMutation } from 'react-query';
import { useParams } from 'react-router';
import api from '../../api';
// @ts-ignore
import ImgsViewer from 'react-images-viewer'
import { useState } from 'react';
import CarDetailBox from './CarDetailBox';
import { gradeToInfo } from '../../helpers/gradeToInfo'
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import {
    Check
} from 'tabler-icons-react';

function InviteLink() {
    const { documentId } = useParams();
    const [open, setIsOpen] = useState(false)
    const [currImg, setCurrImg] = useState(NaN)
    const { data, isLoading } = useQuery('getRequest', () => {
        return api.getRequest(documentId || '');
    });
    const form = useForm({
        initialValues: {
            comments: '',
            finalPrice: 0
        },

        validate: {},
    });


    const [acceptedImages, setAcceptedImages] = useState<string[]>([])


    const declineMutation = useMutation(
        () => {
            return api.sendDeclineEmail(
                {
                    email: data.email,
                    comments: form.values.comments,
                    make: data.make.label,
                    declinedImages: data.imageUrls.filter((item: string) => !acceptedImages.includes(item))
                }
            );
        },
        {
            onSuccess: () => {
            },
            onError: () => { },
        },
    );


    const acceptMutation = useMutation(
        () => {
            return api.sendAcceptEmail(
                {
                    make: data.make.label,
                    email: data.email,
                    finalPrice: form.values.finalPrice,
                }
            );
        },
        {
            onSuccess: () => {
                showNotification({
                    color: 'teal',
                    icon: <Check />,
                    message: 'Request has been finalized for client !',
                });
            },
            onError: () => { },
        },
    );

    if (isLoading) {
        return (
            <Box sx={{ maxWidth: 600, height: 200, position: 'relative' }} mx="auto">
                <LoadingOverlay visible={true} />
            </Box>
        );
    }

    const isReadyForFinalize = acceptedImages.length === data.imageUrls.length

    return (
        <Box sx={{ maxWidth: 600 }} mx="auto" mt="lg">
            <Paper shadow="xs" p="md">
                <Title mb="lg">
                    {"Car details"}
                </Title>
                <CarDetailBox>
                    <Text weight="bold">
                        {"Make: "}
                    </Text>
                    &nbsp;
                    {data.make.label}
                </CarDetailBox>
                <CarDetailBox>
                    <Text weight="bold">
                        {"Model: "}
                    </Text>
                    &nbsp;
                    {data.model.label}
                </CarDetailBox>
                <CarDetailBox>
                    <Text weight="bold">
                        {"Year: "}
                        &nbsp;
                    </Text>
                    {` ${data.year}`}
                </CarDetailBox>
                <CarDetailBox>
                    <Text weight="bold" color="blue">
                        {gradeToInfo[data.grade as any]}
                    </Text>
                </CarDetailBox>
                <CarDetailBox>
                    <Text weight="bold" color="green">
                        ${data.priceRange.from} - ${data.priceRange.to}
                    </Text>
                </CarDetailBox>
                <Title mb="lg">
                    {"Car photos"}
                </Title>
                <div className="flex">
                    {data.imageUrls.map((item: string, index: number) => {
                        const isAccepted = acceptedImages.some(url => url === item)
                        return (
                            <Card shadow="sm" p="lg" radius="md" style={{ width: "50%", margin: "0px 10px" }} withBorder>
                                <Card.Section className="hover:opacity-90 cursor-pointer" onClick={() => {
                                    setCurrImg(index)
                                    setIsOpen(true)
                                }}>
                                    <Image
                                        src={item}
                                        height={160}
                                        alt="Norway"
                                    />
                                </Card.Section>

                                <Button variant="light" color={isAccepted ? "green" : "blue"} fullWidth mt="md" radius="md" onClick={() => {
                                    if (isAccepted) {
                                        const newData = acceptedImages.filter(url => url !== item)
                                        setAcceptedImages(newData)
                                    } else {
                                        setAcceptedImages([...acceptedImages, item])
                                    }
                                }}>
                                    {isAccepted ? "Accepted" : "Accept"}
                                </Button>
                            </Card>
                        )
                    })}
                </div>
                <ImgsViewer
                    currImg={currImg}
                    imgs={data.imageUrls.map((item: string) => ({
                        src: item
                    }))}
                    isOpen={open}
                    onClickPrev={() => {
                        setCurrImg(currImg - 1)
                    }}
                    onClickNext={() => {
                        setCurrImg(currImg + 1)
                    }}
                    onClose={() => setIsOpen(false)}
                />
                {!isReadyForFinalize && <Title mb="lg" mt="lg">
                    {"Comments"}
                </Title>}
                {!isReadyForFinalize && <Textarea
                    onChange={(e) => form.setFieldValue("comments", e.target.value)}
                    value={form.values.comments}
                    placeholder="Your comment"
                    label="Your comment"
                    withAsterisk
                />}
                <div className="mt-5 mb-5">
                    {isReadyForFinalize && <NumberInput
                        value={form.values.finalPrice}
                        onChange={(data) => form.setFieldValue("finalPrice", data!)}
                        label="Price"
                        size="lg"
                        description={"Please enter price range from " + `$${data.priceRange.from}` + ` to $${data.priceRange.to}`}
                        defaultValue={1000}
                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
                        formatter={(value) =>
                            !Number.isNaN(parseFloat(value!))
                                ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                : '$ '
                        }
                    />}
                </div>

                <div className="mt-5 flex">
                    <Button
                        onClick={() => acceptMutation.mutate()}
                        loading={acceptMutation.isLoading}
                        disabled={acceptedImages.length !== data.imageUrls.length}
                        variant="gradient"
                        type="submit"
                        fullWidth
                        style={{ marginRight: "10px" }}
                        gradient={{ from: 'indigo', to: 'cyan' }}>
                        {'Finalize'}
                    </Button>
                    <Button
                        disabled={isReadyForFinalize}
                        onClick={() => declineMutation.mutate()}
                        loading={declineMutation.isLoading}
                        variant="gradient"
                        type="submit"
                        fullWidth
                        gradient={{ from: 'indigo', to: 'cyan' }}>
                        {'Decline'}
                    </Button>
                </div>
            </Paper>
        </Box>
    );
}

export default InviteLink;
