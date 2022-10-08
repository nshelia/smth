import {
    Box,
    Paper,
    LoadingOverlay,
    Image,
    Button,
    Card,
    Text,
    Group,
    Badge,
    Title
} from '@mantine/core';
import { useQuery, useMutation } from 'react-query';
import { useParams } from 'react-router';
import api from '../../api';
// @ts-ignore
import ImgsViewer from 'react-images-viewer'
import { useState } from 'react';
import CarDetailBox from './CarDetailBox';

function InviteLink() {
    const { documentId } = useParams();
    const [open, setIsOpen] = useState(false)
    const [currImg, setCurrImg] = useState(NaN)
    const { data, isLoading } = useQuery('inviteLink', () => {
        return api.getRequest(documentId || '');
    });

    const [acceptedImages, setAcceptedImages] = useState<string[]>([])


    const mutation = useMutation(
        () => {
            return api.revisionForPhotos(
                documentId,
                {
                    data: data.imageUrls.filter((item: string) => !acceptedImages.includes(item))
                }
            );
        },
        {
            onSuccess: () => {
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
                <div className="mt-5 flex">
                    <Button
                        disabled={acceptedImages.length !== data.imageUrls.length}
                        variant="gradient"
                        type="submit"
                        fullWidth
                        style={{ marginRight: "10px" }}
                        gradient={{ from: 'indigo', to: 'cyan' }}>
                        {'Finalize'}
                    </Button>
                    <Button
                        onClick={() => mutation.mutate()}
                        loading={mutation.isLoading}
                        variant="gradient"
                        type="submit"
                        fullWidth
                        gradient={{ from: 'indigo', to: 'cyan' }}>
                        {'Revision'}
                    </Button>
                </div>
            </Paper>
        </Box>
    );
}

export default InviteLink;
