import { compile } from '@/index'
import CompilationError from '@/errors/CompilationError'

describe('Using components', () => {
    test('it can output values in attributes', async () => {
        const input = `<Text id="{{ id }}" />`
        const definition = `<span></span>`
        const expected = `<span id="headline"></span>`
        const result = await compile(input, {
            environment: { id: 'headline' },
            components: {
                Text: definition,
            },
        })
        expect(result).toBe(expected)
    })

    test('it can output multiple values in the same attribute', async () => {
        const input = `<span class="{{ color }} {{ size }}">Text</span>`
        const expected = `<span class="red large">Text</span>`
        const result = await compile(input, {
            environment: { color: 'red', size: 'large' },
        })
        expect(result).toBe(expected)
    })

    test('it can output multiple values in different attributes', async () => {
        const input = `<span class="{{ class }}" id="{{ id }}">Text</span>`
        const expected = `<span class="text-red" id="text-element">Text</span>`
        const result = await compile(input, {
            environment: { className: 'text-red', id: 'text-element' },
        })
        expect(result).toBe(expected)
    })

    test('it can output the same value multiple times', async () => {
        const input = `<span class="{{ name }}" id="{{ name }}">Text</span>`
        const expected = `<span class="title" id="title">Text</span>`
        const result = await compile(input, {
            environment: { name: 'title' },
        })
        expect(result).toBe(expected)
    })

    test('it can output values concatenated to an existing attribute', async () => {
        const input = `<span class="text-{{ size }}">Text</span>`
        const expected = `<span class="text-large">Text</span>`
        const result = await compile(input, {
            environment: { size: 'large' },
        })
        expect(result).toBe(expected)
    })

    test('it fails if the value has not been defined', async () => {
        const input = `<span class="{{ class }}">Text</span>`
        await expect(
            compile(input, {
                environment: {},
            }),
        ).rejects.toThrow(CompilationError)
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
})

describe('Component templates', () => {
    test('an attribute can be outputted inside a component', async () => {
        const input = `
    <div>
        <Card text="Yo" />
    </div>
    `
        const componentDefiniton = `
    <section class="card">
        <div>{{text}}</div>
    </section>
    `
        const expected = `
    <div>
        <section class="card">
            <div>Yo</div>
        </section>
    </div>
    `
        const result = await compile(input, {
            components: { Card: componentDefiniton },
            environment: {},
        })
        expect(result).toEqualIgnoringWhitespace(expected)
    })

    test('it adds an attribute to the root element if it is not outputted', async () => {
        const input = `
    <div>
        <Card class="card" />
    </div>
    `
        const componentDefiniton = `
    <section>
        <div>Yo</div>
    </section>
    `
        const expected = `
    <div>
        <section class="card">
            <div>Yo</div>
        </section>
    </div>
    `
        const result = await compile(input, {
            components: { Card: componentDefiniton },
            environment: {},
        })
        expect(result).toEqualIgnoringWhitespace(expected)
    })

    test('it does not add the attribute to the root element if it is outputted in text', async () => {
        const input = `
    <div>
        <Card class="card" text="Yo" />
    </div>
    `
        const componentDefiniton = `
    <section>
        <div>{{ text }}</div>
    </section>
    `
        const expected = `
    <div>
        <section class="card">
            <div>Yo</div>
        </section>
    </div>
    `
        const result = await compile(input, {
            components: { Card: componentDefiniton },
            environment: {},
        })
        expect(result).toEqualIgnoringWhitespace(expected)
    })

    test('it does not add the attribute to the root element if it is outputted in an attribute', async () => {
        const input = `
    <div>
        <Card class="card" id="cool-card" />
    </div>
    `
        const componentDefiniton = `
    <section>
        <div class="{{ class }}">Yo</div>
    </section>
    `
        const expected = `
    <div>
        <section id="cool-card">
            <div class="card">Yo</div>
        </section>
    </div>
    `
        const result = await compile(input, {
            components: { Card: componentDefiniton },
            environment: {},
        })
        expect(result).toEqualIgnoringWhitespace(expected)
    })

    test('it preserves default attributes on the root element', async () => {
        const input = `
    <div>
        <Card class="card" />
    </div>
    `
        const componentDefiniton = `
    <section id="card">
        <div>Yo</div>
    </section>
    `
        const expected = `
    <div>
        <section id="card" class="card">
            <div>Yo</div>
        </section>
    </div>
    `
        const result = await compile(input, {
            components: { Card: componentDefiniton },
            environment: {},
        })
        expect(result).toEqualIgnoringWhitespace(expected)
    })

    test('it can override default attributes on the root element', async () => {
        const input = `
    <div>
        <Card id="new-id" />
    </div>
    `
        const componentDefiniton = `
    <section id="default-id">
        <div>Yo</div>
    </section>
    `
        const expected = `
    <div>
        <section id="new-id">
            <div>Yo</div>
        </section>
    </div>
    `
        const result = await compile(input, {
            components: { Card: componentDefiniton },
            environment: {},
        })
        expect(result).toEqualIgnoringWhitespace(expected)
    })

    test('a user can manually merge attributes on the root element', async () => {
        const input = `
    <div>
        <Card class="large" />
    </div>
    `
        const componentDefiniton = `
    <section class="white {{ class }}">
        <div>Yo</div>
    </section>
    `
        const expected = `
    <div>
        <section class="white large">
            <div>Yo</div>
        </section>
    </div>
    `
        const result = await compile(input, {
            components: { Card: componentDefiniton },
            environment: {},
        })
        expect(result).toEqualIgnoringWhitespace(expected)
    })

    test('it can detect whether "class" was used as output', async () => {
        const input = `
    <div>
        <Card class="card" />
    </div>
    `
        const componentDefiniton = `
    <section>
        <div>{{ class }}</div>
    </section>
    `
        const expected = `
    <div>
        <section>
            <div>card</div>
        </section>
    </div>
    `
        const result = await compile(input, {
            components: { Card: componentDefiniton },
            environment: {},
        })
        expect(result).toEqualIgnoringWhitespace(expected)
    })

    test('it preserves the attribute on the root element if the attribute is used elsewhere', async () => {
        const input = `
    <div>
        <Card id="card" />
    </div>
    `
        const componentDefiniton = `
    <section id="pre-defined-id">
        <div>{{ id }}</div>
    </section>
    `
        const expected = `
    <div>
        <section id="pre-defined-id">
            <div>card</div>
        </section>
    </div>
    `
        const result = await compile(input, {
            components: { Card: componentDefiniton },
            environment: {},
        })
        expect(result).toEqualIgnoringWhitespace(expected)
    })

    test.todo('an attributed can be passed down to a nested component')
})
