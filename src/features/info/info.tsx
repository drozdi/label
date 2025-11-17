import { List } from '@mantine/core'
import { TbArrowDown, TbArrowLeft, TbArrowRight, TbArrowUp } from 'react-icons/tb'

export function Info() {
	return (
		<List spacing='xs' size='sm' center>
			<List.Item>
				На редактор этикеток можно зайти через браузер по адресу{' '}
				<a href='http://localhost:13724/' target='_blank'>
					http://localhost:13724/
				</a>
			</List.Item>
			<List.Item>"Shift" - для сохранения пропорций при редактирование</List.Item>
			<List.Item>"Ctrl" - для выделения элементов</List.Item>
			<List.Item>"Del" - удалить выбранные элемент</List.Item>
			<List.Item>"Ctrl" + "+" - Увеличить масштаб</List.Item>
			<List.Item>"Ctrl" + "-" - Уменьшить масштаб</List.Item>
			<List.Item>"Ctrl" + "s" - Сохранить шаблон</List.Item>
			<List.Item>"Ctrl" + "z" - Отменить последнее действие</List.Item>
			<List.Item>"Ctrl" + "y" - Вернуть отменённое действие</List.Item>
			<List.Item>"Ctrl" + "c" - Копировать выбранные элементы</List.Item>
			<List.Item>"Ctrl" + "v" - Вставить скопированые элементы</List.Item>
			<List.Item>
				"<TbArrowDown />,
				<TbArrowUp />,
				<TbArrowLeft />,
				<TbArrowRight />" - смещение по "x" и "y" координатам выбранного элемента
			</List.Item>
		</List>
	)
}
