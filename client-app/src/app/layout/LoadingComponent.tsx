import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import { SemanticSIZES } from "semantic-ui-react/dist/commonjs/generic";

interface IProps {
  inverted?: boolean;
  content?: string;
  size?: string;
}

const LoadingComponent: React.FC<IProps> = ({
  inverted = true,
  content,
  size = "massive"
}) => {
  return (
    <Dimmer active inverted={inverted}>
      <Loader content={content} size={size as SemanticSIZES} />
    </Dimmer>
  );
};

export default LoadingComponent;
