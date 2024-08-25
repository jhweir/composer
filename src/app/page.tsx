"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BlockPreview from "./components/BlockPreview/BlockPreview";
import styles from "./page.module.scss";

export default function Home() {
  const [templates, setTemplates] = useState<any[]>([]);

  useEffect(() => {
    const localTemplates = localStorage.getItem("templates");

    if (localTemplates) {
      console.log("localTemplates: ", JSON.parse(localTemplates));
      setTemplates(JSON.parse(localTemplates));
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* <h1>Welcome to WE</h1> */}
      <Link href="/composer?templateId=new">New Template</Link>
      <div className={styles.templates}>
        {templates.map((template) => (
          <Link
            href={`/composer?templateId=${template.id}`}
            key={template.id}
            className={styles.template}
          >
            <BlockPreview block={template} depth={0} />
          </Link>
        ))}
      </div>
    </div>
  );
}
