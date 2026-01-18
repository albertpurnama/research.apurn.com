## Release on Staging

https://www.notion.so/typedreamhq/API-Staging-Force-Branch-Deploy-743bbe3715de4563aa5fe461eed246ad

## Slate

How `toDOMNode` work:
https://github.dev/ianstormtaylor/slate/blob/5a0d3974d6cb2c099dff4c0976e9390d24c345ad/packages/slate-react/src/plugin/react-editor.ts#L310

the elements are updated in a weakmap with key of `node` and the actual DOMNode. It is updated here:
https://github.dev/ianstormtaylor/slate/blob/5a0d3974d6cb2c099dff4c0976e9390d24c345ad/packages/slate-react/src/components/element.tsx#L49-L50

-----

## Plate

looking through typescript types. Got error here https://github.com/albertpurnama/plate/blob/08e4f1e4b5324347f5b586ad104acbbf5bf0e501/examples/src/TypescriptApp.tsx#L23

**Why do we need `GeneralizeChildrenAndAddEditorProps`?**
Not sure, but when we remove this, `dream-editor` doesn't build properly because somehow `Collection` requires this Generalization

-----

Authentication probably should use https://github.com/react-auth-kit/react-auth-kit

## Autosave

