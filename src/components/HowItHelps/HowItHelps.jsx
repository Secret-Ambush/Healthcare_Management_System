import React from "react";
import Card from "./CardComp.jsx";
import Icon1 from "../../assets/icon/1.png";
import Icon2 from "../../assets/icon/2.png";
import Icon3 from "../../assets/icon/3.png";
import { motion } from "framer-motion";
import { SlideLeft, SlideRight } from "../../utility/animation.js";

const HowItHelps = () => {
  return (
    <section>
      <div className="container py-16 my-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <motion.div
                variants={SlideRight(0.2)}
                whileInView={"animate"}
                initial="initial"
                viewport={{ once: true }}
              >
                <Card
                  icon={Icon1}
                  heading="Nearest Hospitals"
                  text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risussed volutpat non."
                />
              </motion.div>
              <motion.div
                variants={SlideRight(0.4)}
                whileInView={"animate"}
                initial="initial"
                viewport={{ once: true }}
              >
                <Card
                  icon={Icon2}
                  heading="Patient Records"
                  text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risussed volutpat non."
                />
              </motion.div>
              <motion.div
                variants={SlideRight(0.6)}
                whileInView={"animate"}
                initial="initial"
                viewport={{ once: true }}
              >
                <Card
                  icon={Icon3}
                  heading="Local information"
                  text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Risussed volutpat non."
                />
              </motion.div>
            </div>
          </div>
          <motion.div
            variants={SlideLeft(0.8)}
            whileInView={"animate"}
            initial="initial"
            viewport={{ once: true }}
            className="flex flex-col xl:justify-center xl:pr-14"
          >
            <h1 className="text-3xl font-bold text-darkBlue">
              Features
            </h1>
            <p className=" text-gray-400 mt-4">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit
              esse ab natus.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItHelps;
