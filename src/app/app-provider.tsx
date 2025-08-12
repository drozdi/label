import {
	Button,
	createTheme,
	Group,
	Input,
	MantineProvider,
	NumberInput,
	Textarea,
	TextInput,
} from '@mantine/core'
import '@mantine/core/styles.css'
import { ModalsProvider } from '@mantine/modals'
import { Notifications } from '@mantine/notifications'
import '@mantine/notifications/styles.css'

const theme = createTheme({
	components: {
		Group: Group.extend({
			defaultProps: {
				mih: 30,
			},
		}),
		Button: Button.extend({
			defaultProps: {
				size: 'xs',
				radius: 0,
				variant: 'subtle',
			},
		}),
		Input: Input.extend({
			defaultProps: {
				variant: 'filled',
				size: 'xs',
				radius: 0,
			},
		}),
		Textarea: Textarea.extend({
			defaultProps: {
				variant: 'filled',
				size: 'xs',
				rows: 3,
				radius: 0,
				rightSectionProps: {
					style: {
						alignItems: 'flex-start',
					},
				},
			},
		}),
		TextInput: TextInput.extend({
			defaultProps: {
				variant: 'filled',
				size: 'xs',
				radius: 0,
			},
		}),
		NumberInput: NumberInput.extend({
			defaultProps: {
				variant: 'filled',
				size: 'xs',
				radius: 0,
			},
		}),
	},
})

export function AppProvider({ children }: { children: React.ReactNode }) {
	return (
		<MantineProvider theme={theme}>
			<Notifications />
			<ModalsProvider>{children}</ModalsProvider>
		</MantineProvider>
	)
}
