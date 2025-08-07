import {
	Button,
	createTheme,
	Group,
	Input,
	MantineProvider,
	NumberInput,
	TextInput,
} from '@mantine/core'
import '@mantine/core/styles.css'

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
	return <MantineProvider theme={theme}>{children}</MantineProvider>
}
