import React from "react";
import styles from "./ListElement.module.css";

type ListElementPropsType = {
  title: string;
  name: string;
  isActive: boolean;
};

const ListElement = React.forwardRef<
  HTMLLIElement | null,
  ListElementPropsType
>((props, ref) => {
  let style = styles.list_element;

  if (props.isActive) {
    style = `${style} ${styles.active}`;
  }
  return (
    <li ref={ref} className={style}>
      <h3>{props.title}</h3>
      <h4>{props.name}</h4>
    </li>
  );
});

export default ListElement;
