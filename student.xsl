<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output method="html" indent="yes" />
    <xsl:template match="/">
        <html>
            <head>
                <title>Student Report Card</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    table, th, td {
                        border: 1px solid #ccc;
                    }
                    th, td {
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f4f4f4;
                    }
                </style>
            </head>
            <body>
                <h1>Student Report Card</h1>
                <xsl:for-each select="students/student">
                    <h2>
                        Name: <xsl:value-of select="name" />
                    </h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Subject</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            <xsl:for-each select="subjects/subject">
                                <tr>
                                    <td><xsl:value-of select="name" /></td>
                                    <td><xsl:value-of select="grade" /></td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>
                    <p>
                        Total Marks: 
                        <xsl:value-of select="sum(subjects/subject/grade)" />
                    </p>
                    <p>
                        Average Score: 
                        <xsl:value-of select="format-number(sum(subjects/subject/grade) div count(subjects/subject/grade), '0.00')" />
                    </p>
                    <hr />
                </xsl:for-each>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
