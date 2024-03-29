import compileNode from '@/language/compileNode'
import compileAttributes from '@/language/compileAttributes'
import normaliseExpressionsInAttributes from '@/helpers/normaliseExpressionsInAttributes'

export default function (node, context) {
    const newNode = { ...node }
    const [properties, usedIdentifiers] = compileAttributes(
        normaliseExpressionsInAttributes(node.properties),
        context,
    )

    newNode.meta = {
        usedIdentifiers,
    }

    newNode.properties = properties

    newNode.children = newNode.children.flatMap(childNode =>
        compileNode(childNode, context),
    )

    return [newNode]
}
