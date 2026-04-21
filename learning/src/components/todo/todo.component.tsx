export interface ListProp {
  status: string;
  title: string;
  description: string;
}

const style = {
  content: {
    // backgroundColor: "red",
    display: "flex",
    flexFlow: "column,wrap",
    gap: 15,
    alignItems: "center",
    border: "1px solid black",
    width: "",
  },
  status: {
    backgroundColor: "rgba(255, 0, 0,.5)",
    color: "rgba(0,0,0,1)",
    border: "2px solid rgba(255,0,0,1)",
    padding: "0px 15px",
    borderRadius: "8px",
  },
  col: {
    border: "1px solid black",
    margin: "10px",
    width: "auto",
  },
};

export default function List(list: ListProp) {
  return (
    <tr style={style.content}>
      <td className="" style={style.col}>
        {list.title}
      </td>
      <td className="" style={style.col}>
        {list.description}
      </td>
      <td className="" style={style.col}>
        {list.status}
      </td>
    </tr>
  );
}
