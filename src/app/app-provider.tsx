import {
	Button,
	createTheme,
	Group,
	Input,
	MantineProvider,
	NumberInput,
	Stack,
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
				gap: 'xs',
			},
		}),
		Stack: Stack.extend({
			defaultProps: {
				gap: 'xs',
			},
		}),
		Button: Button.extend({
			defaultProps: {
				size: 'xs',
				radius: 0,
				variant: 'subtle',
				px: '0.25rem',
			},
		}),
		Input: Input.extend({
			defaultProps: {
				variant: 'filled',
				size: 'xs',
				radius: 0,
				rightSectionWidth: 'auto',
			},
		}),
		Textarea: Textarea.extend({
			defaultProps: {
				variant: 'filled',
				size: 'xs',
				rows: 3,
				radius: 0,
				rightSectionWidth: 'auto',
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
				rightSectionWidth: 'auto',
			},
		}),
		NumberInput: NumberInput.extend({
			defaultProps: {
				variant: 'filled',
				size: 'xs',
				radius: 0,
				rightSectionWidth: 'auto',
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
