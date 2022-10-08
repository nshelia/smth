import { ThemeIcon, Container, Paper, Title, Table } from '@mantine/core';
import { IconCircleCheck, IconCircleMinus, IconCircleDashed } from '@tabler/icons';
import { loadState } from '../../helpers/persist';
import api from '../../api/index'
import { useQuery } from 'react-query'
import Message from '../../components/Message';
import { formatDistance } from 'date-fns'

function Demo() {

    const { data, isLoading } = useQuery('getRequestList', () => {
        return api.getRequestList(loadState("request-ids"));
    });

    const getIcon = (status: string) => {
        switch (status) {
            case "rejected":
                return <ThemeIcon color="red" size={24} radius="xl">
                    <IconCircleMinus size={16} />
                </ThemeIcon>
            case "accepted":
                return <ThemeIcon color="teal" size={24} radius="xl">
                    <IconCircleCheck size={16} />
                </ThemeIcon>
            case "pending":
                return <ThemeIcon color="blue" size={24} radius="xl">
                    <IconCircleDashed size={16} />
                </ThemeIcon>
            default:
                break;
        }
    }

    if (isLoading) {
        return null
    }

    function renderRows() {
        return data?.map((item: any) => <tr>
            <td>{item.make.label}</td>
            <td>{item.model.label}</td>
            <td className="flex items-center">{getIcon(item.state)} <span className="ml-2 capitalize">
                {item.state}
            </span></td>
            <td>
                {formatDistance(new Date(item.createdDate), new Date(), { addSuffix: true })}
            </td>
        </tr>)
    }

    return (
        <main style={{ marginTop: '50px' }}>
            <Container size="xs" px="xs">
                <Paper shadow="xs" p="md">
                    <Title mb="lg">
                        {"Requests"}
                    </Title>
                    {data!.length !== 0 ? <Table>
                        <thead>
                            <tr>
                                <th>Make</th>
                                <th>Model</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderRows()}
                        </tbody>
                    </Table> : <Message text="You have no requests currently" />}
                </Paper>
            </Container>
        </main>
    );
}

export default Demo