import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { FormFieldProps, Form, Label } from 'semantic-ui-react';

interface IProps
  extends FieldRenderProps<string, HTMLTextAreaElement>,
    FormFieldProps {}

const TextAreaInput: React.FC<IProps> = ({
  input,
  placeholder,
  width,
  rows,
  meta: { error, touched }
}) => {
  return (
    <Form.Field error={touched && !!error} width={width}>
      <textarea
        {...input}
        placeholder={placeholder}
        rows={rows}
        autoComplete="off"
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};

export default TextAreaInput;
