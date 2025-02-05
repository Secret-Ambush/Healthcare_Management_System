import React, { useContext } from "react";
import HeroImage from "../../assets/hero.png";
import { SlideUp } from "../../utility/animation";
import { motion } from "framer-motion";
import { UserContext } from "../../context/UserContext"; // Import UserContext

const Hero = () => {
  const { user } = useContext(UserContext); // Access user from context

  return (
    <section>
      <div className="bg-brandWhite rounded-3xl container grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[650px]">
        {/* Text section */}
        <div className="flex flex-col justify-center xl:pr-40">
          <div className="mt-24 mb-10 md:mt-0 md:mb-0 space-y-6 text-center md:text-left">
            {user && user.name && (
              <motion.h2
                variants={SlideUp(0.1)}
                whileInView={"animate"}
                initial="initial"
                viewport={{ once: true }}
                className="text-3xl font-semibold text-primary"
              >
                Hello, {user.name}!
              </motion.h2>
            )}
            <motion.h1
              variants={SlideUp(0.2)}
              whileInView={"animate"}
              initial="initial"
              viewport={{ once: true }}
              className="text-5xl font-bold text-darkBlue"
            >
              Healthcare Management <br /> System
            </motion.h1>
            <motion.p
              variants={SlideUp(0.4)}
              whileInView={"animate"}
              initial="initial"
              viewport={{ once: true }}
              className="text-lg text-gray-400 mt-4 "
            >
              A comprehensive one-stop solution for all healthcare related systems.
            </motion.p>
          </div>
        </div>

        {/* Image section */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex items-center justify-center"
        >
          <img src={HeroImage} alt="" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
