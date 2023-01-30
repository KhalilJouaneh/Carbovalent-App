import React from "react";
import carbovalentWhiteText from "/public/carbovalent_whitetext.svg";
import Image from "next/image";
import { BsTwitter } from "react-icons/bs";
import { BsGlobe2 } from "react-icons/bs";
import { GiWhiteBook } from "react-icons/gi";
import { BsInstagram } from "react-icons/bs";

export function Footer() {
  return (
    <>
      <footer className="footer p-10 bg-[#1B71E8] text-base text-white h-[250px] ">
          <div>
            <Image
              src={carbovalentWhiteText}
              height={225}
              width={225}
              alt="Carbovalent logo"
              className="pt-20"
            />
            <p>info@carbovalent.com</p>

            <div className="pt-20">
              <div className="grid grid-flow-col gap-5">
                <a
                  href="https://carbovalent.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <BsGlobe2 size={25} />
                </a>
                <a
                  href="https://docs.carbovalent.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <GiWhiteBook size={25} />
                </a>
                <a
                  href="http://www.twitter.com/carbovalent"
                  target="_blank"
                  rel="noreferrer"
                >
                  <BsTwitter size={25} />
                </a>
                <a
                  href="https://www.instagram.com/carbovalent/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <BsInstagram size={25} />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-20">
            <a className="link link-hover">Home</a>
            <a className="link link-hover">App</a>
            <a className="link link-hover">ThinkCarbon</a>
            <a className="link link-hover">Contact Us</a>
          </div>
          <div className="pt-20">
            <a className="link link-hover">Disclaimer</a>
            <a className="link link-hover">Documentation</a>
            <a className="link link-hover">Terms &amp; Conditions</a>
            <a className="link link-hover">Privacy Policy</a>
          </div>
      </footer>

      <footer className="footer px-10 py-[150px] text-base-content bg-[#1B71E8] h-[300px]">
        <div className="items-center grid-flow-col text-white">
          <p>Copyright &copy; 2022, carbovalent.com. All Rights Reserved.</p>
        </div>
      </footer>
    </>
  );
}
