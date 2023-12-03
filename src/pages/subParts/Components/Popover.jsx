import { useState } from "react";
import "./style.css";
import { Badge, Popover } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  deleteNotification,
  updateNotification,
} from "../../../utils/notificationAction";
import { useDispatch } from "react-redux";
import {
  deleteNotificationById,
  updateIsRead,
} from "../../../redux/notificationSlide";

export function Noti(props) {
  return (
    <div className="notiContent p-2 d-flex">
      <Badge dot={!props.isRead} color="red" status="processing">
        {props.isErrNoti ? (
          <img alt="" className="iconNotiMess" src="/images/notFound.png" />
        ) : (
          <img alt="" className="iconNotiMess" src="/images/found.png" />
        )}
      </Badge>
      <small className={!props.isRead ? "ms-2 fw-bolder" : "ms-2"}>
        {props.notiContent}
      </small>
    </div>
  );
}

export function PopoverComponent(props) {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const handleReadNoti = async (id, isReadNoti) => {
    if (!isReadNoti) {
      dispatch(updateIsRead({ id, isRead: true }));
      await updateNotification(id, true, token);
    }
  };

  const handleDeleteNoti = async (id) => {
    dispatch(deleteNotificationById(id));
    await deleteNotification(id, token);
  };

  return (
    <Popover
      content={
        <li className="notiList">
          {props.content.length > 0 ? (
            props.content.map((item, index) => (
              <ul className="d-flex justify-content-between">
                <div onClick={() => handleReadNoti(item.id, item.isRead)}>
                  <Noti
                    key={index}
                    notiContent={item.text}
                    isErrNoti={item.isErrorNoti}
                    isRead={item.isRead}
                  />
                </div>
                <button
                  onClick={() => handleDeleteNoti(item.id)}
                  className="border-0 bg-transparent"
                >
                  <FontAwesomeIcon icon={faTrash} className="text-black-50" />
                </button>
              </ul>
            ))
          ) : (
            <ul>Good job! Looks like you're all caught up.</ul>
          )}
        </li>
      }
      title={props.title}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      {props.object}
    </Popover>
  );
}
