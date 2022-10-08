import { Box } from '@mantine/core';

function CarDetailBox({ children }) {
  return (
    <Box
      className="flex items-center justify-center"
      sx={(theme) => ({
        height: '50px',
        marginBottom: '10px',
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[2],
        textAlign: 'center',
        padding: '15px',
        borderRadius: theme.radius.md,
        cursor: 'pointer',

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[5]
              : theme.colors.gray[1],
        },
      })}>
      {children}
    </Box>
  );
}

export default CarDetailBox;
