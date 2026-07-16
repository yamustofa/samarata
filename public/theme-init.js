try {
	const savedTheme = localStorage.getItem("prorata-theme");
	const isDark =
		savedTheme === "dark" ||
		(!savedTheme && matchMedia("(prefers-color-scheme: dark)").matches);
	document.documentElement.classList.toggle("dark", isDark);
} catch {}
