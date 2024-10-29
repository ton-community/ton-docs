import os
import re
import json
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


class MoveEventHandler(FileSystemEventHandler):
    def on_moved(self, event):
        if ('.git' in event.src_path) or ('.git' in event.dest_path) or ('node_modules' in event.src_path) or ('node_modules' in event.dest_path) or ('.docusaurus' in event.src_path) or ('.docusaurus' in event.dest_path):
            return

        if event.is_directory:
            print(f"Directory moved from {event.src_path} to {event.dest_path}")
        else:
            print(f"File moved from {event.src_path} to {event.dest_path}")

        repo_path = os.getcwd()

        source = get_redirect(event.src_path, repo_path)
        destination = get_redirect(event.dest_path, repo_path)

        print("from_r:",source)
        print("to_r:", destination)

        # path_r = destination.split("/")[1]
        json_file = f"./redirects/redirects.json"
        file_extensions = ['.mdx', '.md']

        replace_in_repo(repo_path, source, destination, file_extensions)
        redirect(json_file, source, destination)


def start_monitoring(path):
    event_handler = MoveEventHandler()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)

    print(f"Monitoring moves in: {path}")
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()


def find_markdown_links(text):
    md_link_pattern = r'\[([^\]]+)\]\(([^#)]+)([^)]*)\)'
    print(md_link_pattern)
    matches = re.findall(md_link_pattern, text)

    return matches

def replace_word_in_file(file_path, target, replacement):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    if target[0] == "/" and replacement[0] == "/":
        target = target[1:]
        replacement = replacement[1:]

    content_replaced = content.replace(target, replacement)
    if content_replaced != '' and content != content_replaced:
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(content_replaced)
        print(f"Replaced in file: {file_path}")


def replace_in_repo(repo_path, target, replacement, file_extensions=None):
    for root, dirs, files in os.walk(repo_path):
        if ('.git' in root) or ('i18n' in root) or ('node_modules') in root or ('.docusaurus') in root:
            continue

        if root == repo_path:
            for file_name in files:
                if file_name == "navbar.js" or file_name == "redirects.js":
                    file_path = os.path.join(root, file_name)
                    replace_word_in_file(file_path, target, replacement)
            continue

        path_list = root.split(repo_path)
        if len(path_list) > 1 and path_list[1] == "/sidebars":
            for file_name in files:
                file_path = os.path.join(root, file_name)
                replace_word_in_file(file_path, target, replacement)
            continue

        for file_name in files:
            if file_extensions:
                if not any(file_name.endswith(ext) for ext in file_extensions):
                    continue

            if root.find("node_modules") != -1:
                continue

            file_path = os.path.join(root, file_name)
            replace_word_in_file(file_path, target, replacement)

def get_redirect(path, repo):
    res = os.path.splitext(path)
    res = res[0]
    spl = res.split(repo)
    res = spl[1].split('/docs', 1)
    res = res[1]
    return res

def redirect(json_file, from_r, to_r):
    obj = {
        "from": from_r,
        "to": to_r
    }

    with open(json_file, 'r') as file:
        data = json.load(file)

    prev = next((x for x in data if x["to"] == obj["from"]), None)

    if prev:
        prev["to"] = obj["to"]
    else:
        data.append(obj)

    with open(json_file, 'w') as file:
        json.dump(data, file, indent=4)


if __name__ == "__main__":
    repo_path = os.getcwd()

    event_handler = MoveEventHandler()
    observer = Observer()
    observer.schedule(event_handler, repo_path, recursive=True)

    print(f"Monitoring moves in: {repo_path}")
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()
