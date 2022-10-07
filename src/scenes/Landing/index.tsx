// @ts-nocheck

import { Container, Paper,Text, Title, Select,SegmentedControl, Group,Loader } from '@mantine/core';
import { useQuery } from 'react-query';
import api from '../../api';
import { useState } from 'react';
import models from './models.json'
import { TextInput } from '@mantine/core';
import Message from '../../components/Message'
import { gradeToInfo } from './gradeToInfo'
import {
  Upload,
  Check,
  Photo,
  X,
  Icon as TablerIcon,
  FileAlert,
} from 'tabler-icons-react';
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import useImageUpload from './useImageUpload'

const realModels = models.map(item => ({
  manId: item.man_id,
  value: item.model_id,
  label: item.model_name
}))

function ImageUploadIcon({
  status,
  ...props
}: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
  if (status.accepted) {
    return <Upload {...props} />;
  }

  if (status.rejected) {
    return <X {...props} />;
  }

  return <Photo {...props} />;
}
function Landing() {

  const { onSelectImage, preview, resetImage, imageUrl, uploading, failed } =
    useImageUpload();
  const [selectedMan, setSelectedMan] = useState();
  const [selectedModel, setSelectedModel] = useState();
  const [mileage, setMilage] = useState();
  const [grade, setGrade] = useState('grade5');

  const { data: manufacturers, isLoading } = useQuery('manufacturers', () => {
    return api.fetchMain();
  });

  if (isLoading) {
    return null;
  }

  let transformedModels = realModels.filter(item => item.manId === parseInt(selectedMan))

  return (
    <main style={{ marginTop: '50px' }}>
      <Container size="xs" px="xs">
        <Paper shadow="xs" p="md">
          <Title order={1} style={{ marginBottom: '10px' }}>
            Please input your car details
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
            style={{marginTop: "10px"}}
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
            style={{marginTop: "10px"}}
            placeholder="Enter milage in kilometers"
            label="Enter milage (km)"
            value={mileage} 
            onChange={(event) => setMilage(event.currentTarget.value)} 
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
                  {preview ? (
          <div
            className="w-32 h-32  m-auto left-0 right-0 block image-wrapper"
            onClick={resetImage}>
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
              <div className="w-32 h-32 opacity-0 hover:opacity-50 bg-black overflow-hidden rounded-full z-10 absolute flex items-center justify-center cursor-pointer">
                <X color="white" size="40" />
              </div>
            )}
            <img
              alt="profile-pic"
              src={preview}
              className="w-32 h-32 object-cover rounded-full"
            />
          </div>
        ) : (
          <Dropzone
            onDrop={onSelectImage}
            accept={IMAGE_MIME_TYPE}>
            {(status) => (
              <Group
                position="center"
                spacing="xl"
                style={{ minHeight: 110, pointerEvents: 'none' }}>
                <ImageUploadIcon
                  status={status}
                  size={80}
                />

                <div>
                  <Text size="xl" inline>
                    Click here to upload profile photo
                  </Text>
                </div>
              </Group>
            )}
          </Dropzone>
        )}
        </Paper>
      </Container>
    </main>
  );
}

export default Landing;
