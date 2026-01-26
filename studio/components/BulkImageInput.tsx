import {Stack, Card, Text, Box} from '@sanity/ui'
import {ArrayOfObjectsInputProps} from 'sanity'

export function BulkImageInput(props: ArrayOfObjectsInputProps) {
  return (
    <Stack space={3}>
      <Card padding={3} radius={2} shadow={1} tone="primary">
        <Box>
          <Text size={1} weight="semibold">
            💡 Quick Bulk Upload Instructions
          </Text>
        </Box>
        <Box marginTop={2}>
          <Text size={1} muted>
            1. Go to the "Media" tab in the left sidebar<br />
            2. Upload all your photos there first (drag & drop multiple files)<br />
            3. Come back here and click "+ Add item" for each photo you want<br />
            4. Or: Select multiple photos in Media tab, then look for "Insert into document" option
          </Text>
        </Box>
      </Card>

      {props.renderDefault(props)}
    </Stack>
  )
}
