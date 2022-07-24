import React from "react";
import { ImageType, TextType } from "../../ApiContext/api/types/nextStep";
import Heading from "../../common/Heading/Heading";

import styles from "./styles.module.css";

enum InstructionSectionType {
  title = "title",
  description = "description",
  image = "image",
}

interface InstructionViewProps {
  sections: Array<TextType | ImageType>;
}

const InstructionBody: React.FC<InstructionViewProps> = (props) => {
  return (
    <>
      {props.sections.map((section, index) => {
        switch (section.type) {
          case InstructionSectionType.title: {
            const sectionData = section as TextType;
            return (
              <Heading
                key={index}
                text={sectionData.text}
                textAlign={sectionData.align}
                className={styles.heading}
              />
            );
          }
          case InstructionSectionType.description: {
            const sectionData = section as TextType;
            return (
              <Heading
                key={index}
                textSubHeading={sectionData.text}
                textAlign={sectionData.align}
                className={styles.heading}
              />
            );
          }
          case InstructionSectionType.image: {
            const sectionData = section as ImageType;
            return (
              <div className={`${styles.center} ${styles["item-wrapper"]}`}>
                {sectionData.items.map((item, index) => {
                  return (
                    <div
                      className={`${styles.center} ${styles.item}`}
                      key={index}
                    >
                      <img src={item.image} />
                      {item.text && (
                        <div className={styles["item-text"]}>{item.text}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          }
          default:
            return null;
        }
      })}
    </>
  );
};

export default InstructionBody;
