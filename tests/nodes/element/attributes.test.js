import { compile } from '@/index'
import CompilationError from '@/errors/CompilationError'

test('it can compile expressions in attributes', async () => {
    const input = `<span id="{{ id }}">Text</span>`
    const expected = `<span id="headline">Text</span>`

    const result = await compile(input, {
        environment: { id: 'headline' },
    })

    expect(result).toBe(expected)
})

test('it can compile multiple expressions in the same attribute', async () => {
    const input = `<span class="{{ color }} {{ size }}">Text</span>`
    const expected = `<span class="red large">Text</span>`

    const result = await compile(input, {
        environment: { color: 'red', size: 'large' },
    })

    expect(result).toBe(expected)
})

test('it can compile multiple expressions in different attributes', async () => {
    const input = `<span class="{{ class }}" id="{{ id }}">Text</span>`
    const expected = `<span class="text-red" id="text-element">Text</span>`

    const result = await compile(input, {
        environment: { className: 'text-red', id: 'text-element' },
    })

    expect(result).toBe(expected)
})

test('it can compile the same expression multiple times', async () => {
    const input = `<span class="{{ name }}" id="{{ name }}">Text</span>`
    const expected = `<span class="title" id="title">Text</span>`

    const result = await compile(input, {
        environment: { name: 'title' },
    })

    expect(result).toBe(expected)
})

test('it can compile expressions concatenated to an existing attribute', async () => {
    const input = `<span class="text-{{ size }}">Text</span>`
    const expected = `<span class="text-large">Text</span>`

    const result = await compile(input, {
        environment: { size: 'large' },
    })

    expect(result).toBe(expected)
})

test('it can handle an undefined identifier', async () => {
    const input = `<span class="{{ class }}">Text</span>`
    const expected = `<span class="">Text</span>`

    const result = await compile(input, {
        environment: {},
    })

    expect(result).toBe(expected)
})

test('it ignores regular string attributes', async () => {
    const input = `<span class="text">Text</span>`
    const expected = `<span class="text">Text</span>`

    const result = await compile(input, {
        environment: {},
    })

    expect(result).toBe(expected)
})

test('it ignores regular boolean attributes', async () => {
    const input = `<input disabled="true" />`
    const expected = `<input disabled />`

    const result = await compile(input, {
        environment: {},
    })

    expect(result).toBe(expected)
})

test('it ignores regular number attributes', async () => {
    const input = `<input maxlength="4" />`
    const expected = `<input maxlength="4" />`

    const result = await compile(input, {
        environment: {},
    })

    expect(result).toBe(expected)
})

test('it ignores attributes with an empty value', async () => {
    const input = `<input disabled="" />`
    const expected = `<input disabled />`

    const result = await compile(input, {
        environment: {},
    })

    expect(result).toBe(expected)
})

test('it ignores attributes with no value', async () => {
    const input = `<input disabled />`
    const expected = `<input disabled />`

    const result = await compile(input, {
        environment: {},
    })

    expect(result).toBe(expected)
})

test('it can compile an expression that contains spaces', async () => {
    const input = `
    <div class="existing {{ class or '' }}"></div>
    `
    const expected = `
    <div class="existing passed"></div>
    `
    const result = await compile(input, {
        components: {},
        environment: {
            class: 'passed',
        },
    })
    expect(result).toEqualIgnoringWhitespace(expected)
})
